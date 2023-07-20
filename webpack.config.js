const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const build_folder = "./src/"
const production_folder = "./prod/"
const Test_ID = __dirname.split("\\").pop().trim().replace(/ /g, "-")

const setTestClassName = (opts = {}) => {
	return {
		postcssPlugin: "postcss-set-test-class-name",
		Rule: (rule) => {
			console.log({rule})
			rule.selector = rule.selector.replace(/pah000/gi, Test_ID)
			console.log({selector: rule.selector})
		},
	};
};

const config = {
	entry: {
		control: `${build_folder}control/index.js`,
		variation_1: `${build_folder}variation_1/index.js`,
	},
	node: {
		__dirname: true,
		__filename: true,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, production_folder)
	},
	mode: 'production',
	devtool: false,
	optimization: {
        minimize: true,
		minimizer: [
			new TerserPlugin()
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader'
				}
			},
			{
				test: /\.svg$/,
				use: {
					loader: 'svg-inline-loader'
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [setTestClassName()],
							},
						},
					},
				]
			},
			{
				test: /\.scss$/,
				use: [
					'css-loader',
					'sass-loader',
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [setTestClassName()],
							},
						},
					},
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			TEST: JSON.stringify({
				id: Test_ID,
			}),
		})
	]
};

module.exports = config;