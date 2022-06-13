const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require("path"); //Trabaja con archivo y rutas de directorios

module.exports = {
  mode: 'development',
  watch: true,
  entry: "./src/index.js", //le pasamos nuestro punto de entrada
  output: {
    //esta es la salida del bundle
    path: path.resolve(__dirname, "dist"), //da la ruta absoluta hasta nuestro archivo
    filename: "[name].[contenthash].js", //archivo final
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js"], //archivos que webpack va a leer
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    }
  },
  module: {
    // establece va a tener las reglas del proyecto
    rules: [
      {
        //test declara que extension de archivos aplicara el loader
        test: /\.m?js$/,
        //use es un arreglo u objeto donde dices que loader aplicaràs
        use: {
          loader: "babel-loader",
        },
        //Excluye archivos o carpetas especificas
        exclude: /node_modules/,
      },
      {
        test: /\.(css|styl)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000, // O LE PASAMOS UN BOOLEANOS TRUE O FALSE
            // Habilita o deshabilita la transformación de archivos en base64.
            mimetype: "aplication/font-woff",
            // Especifica el tipo MIME con el que se alineará el archivo.
            // Los MIME Types (Multipurpose Internet Mail Extensions)
            // son la manera standard de mandar contenido a través de la red.
            name: "[name].[contenthash].[ext]",
            // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
            // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria
            // ubuntu-regularhola.woff
            outputPath: "./assets/fonts/",
            // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
            publicPath: "../assets/fonts/",
            // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
            esModule: false,
            // AVISAR EXPLICITAMENTE SI ES UN MODULO
          },
        },
      },
    ],
  },
  //PLugins
  plugins: [
    new HtmlWebpackPlugin({
      //configuracion del puglin
      inject: true, //inyecta el bundle al template
      template: "./public/index.html", //la ruta del template
      filename: "./index.html", //nombre final del archivo
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"), //carpeta a mover al dist
          to: "assets/images", //ruta final del dist
        },
      ],
    }),
    new Dotenv(),
    new BundleAnalyzerPlugin()//instanciamos el plugin
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    port: 3000,
  }
};
