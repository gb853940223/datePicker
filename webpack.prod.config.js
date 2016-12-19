var webpack = require('webpack');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var outputPath = path.join(__dirname, '../../../public/admin/js');
module.exports = {
  entry: {
    index: ["./build/src/js/index.js"],
    login:["./build/src/js/login.js"],
    headMenu:["./build/src/js/headMenu.js"],
    //settings
    roleList:["./build/src/js/settings/roleList.js"],
    accountsList:["./build/src/js/settings/accountsList.js"],
    assignPermissions:["./build/src/js/settings/assignPermissions.js"],
    addUsers:["./build/src/js/settings/addUsers.js"],
    editUsers:["./build/src/js/settings/editUsers.js"],
    paymentMethods:["./build/src/js/settings/paymentMethods.js"],
    otherSetting:["./build/src/js/settings/otherSetting.js"],
    cinemasList:["./build/src/js/settings/cinemasList.js"],
    cinemaEdit:["./build/src/js/settings/cinemaEdit.js"],
    messageTemplate:["./build/src/js/settings/messageTemplate.js"],
    messageLog:["./build/src/js/settings/messageLog.js"],
    report:["./build/src/js/settings/report.js"],
    ordersList:["./build/src/js/settings/ordersList.js"],
    detailList:["./build/src/js/settings/detailList.js"],
    unusualList:["./build/src/js/settings/unusualList.js"],
    refundList:["./build/src/js/settings/refundList.js"],
    //settings
    //userAdmin
    usersList:["./build/src/js/userAdmin/usersList.js"],
    userDetail:["./build/src/js/userAdmin/userDetail.js"],
    //userAdmin
    tabCommon:["./build/src/js/tabCommon.js"]
  },
  output: {
    path: outputPath,
    filename: "[name].js"
  },
  externals: {
        //不需要打包的js文件, 一般是库
        // require("jquery") is external and available
        //  on the global var jQuery
        // "lodash": "_",
        // "react": "React",
        // "react-router":"ReactRouter",
        // "react-dom":"ReactDOM",
        //"jquery":"$"

  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: "common",
        minChunks: 2
   }),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};
