module.exports = function(grunt) {
	grunt.initConfig({
		// running `grunt less` will compile once
		less: {
			development: {
				options: {
					paths: ["asset/css"]
				},
				files: {
					"asset/css/style.css": "asset/less/style.less",
				}
			},
			production: {
				options: {
					paths: ["asset/css"],
					compress: true,
					sourceMap: true
				},
				files: {
					"asset/css/style.css": "asset/less/style.less",
				}
			}
		},
		autoprefixer: {
			development: {
				browsers: ['last 2 versions'],
				expand: true,
				flatten: true,
				src: "asset/css/*.css",
				dest: "./asset/css"
			},
			production: {
				browsers: ['last 2 versions'],
				expand: true,
				flatten: true,
				map: true,
				src: "asset/css/*.css",
				dest: "asset/css"
			}
		},
		// running `grunt watch` will watch for changes
		watch: {
			less: {
				files: "asset/less/*.less",
				tasks: ["less"]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.registerTask('default', ['less:development', 'autoprefixer:development']);
	grunt.registerTask('build', ['less:production', 'autoprefixer:production']);
};
