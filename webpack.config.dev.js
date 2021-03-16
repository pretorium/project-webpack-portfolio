/** Para trabajar con archivos y rutas de directorios */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  /** Le pasamos explicitamente el modo desde el archivo */
  mode: 'development',

  /** El punto de entrada de mi aplicación */
  entry: './src/index.js',

  /** Esta es la salida de mi bundle */
  output: {
    /** Resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo,
     *  para no tener conflictos entre Linux, Windows, etc
     */
    path: path.resolve(__dirname, 'dist'),

    /** El Nombre del archivo final */
    filename: '[name].[contenthash].js',

    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },

  resolve: {
    /** Los Archivos que webpack va a leer */
    extensions: ['.js'],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    }
  },

  module: {
    rules: [
      {
        /** Test declara que extensión de archivos aplicara el loader */
        test: /\.m?js$/,

        /** Use es un arreglo u objeto donde dices que loader aplicaras */
        use: {
          loader: "babel-loader",
        },

        /** Exclude permite omitir archivos o carpetas especificas */
        exclude: /node_modules/,
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2)$/, // REGLA PARA ARCHIVOS WOFF | WOFF2
        use: {
          loader: 'url-loader', // NOMBRE DEL LOADER
          options: {
            limit: false, // O LE PASAMOS UN NUMERO
            // Habilita o deshabilita la transformación de archivos en base64.
            mimetype: 'aplication/font-woff',
            // Especifica el tipo MIME con el que se alineará el archivo. 
            // Los MIME Types (Multipurpose Internet Mail Extensions)
            // son la manera standard de mandar contenido a través de la red.
            name: "[name].[contenthash].[ext]",
            // EL NOMBRE INICIAL DEL PROYECTO + SU EXTENSIÓN
            // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria 
            // ubuntu-regularhola.woff
            outputPath: './assets/fonts/',
            // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
            publicPath: '../assets/fonts/',
            // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
            esModule: false
          }
        }
      }
    ]
  },

  plugins: [
    /** Configuración del plugin */
    new HtmlWebpackPlugin({
      /** Inyecta el bundle al template html */
      inject: true,

      /** La ruta al template html */
      template: './public/index.html',

      /** Nombre final del archivo */
      filename: './index.html',
    }),

    /** Instanciamos el plugin */
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),

    // CONFIGURACIÓN DEL COPY PLUGIN
    new CopyPlugin({
      patterns: [
        {
          // CARPETA A MOVER AL DIST
          from: path.resolve(__dirname, "src", 'assets/images'),
          // RUTA FINAL DEL DIST
          to: "assets/images" 
        }
      ]
    }),
    new Dotenv(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    port: 3000,
  }
};

/**
 * COMANDOS
 * npx webpack --mode production --config webpack.config.js
 */
