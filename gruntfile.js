module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],//监听的文件位置
                options: {
                    //代码发生变化时重启服务
                    livereload: true  
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },

       nodemon: {
            dev: {
                script: 'app.js',
                options:{
                ignore: ['node_modules/**'],
                ext:'js,coffee',
                delay: 1000
                }
            }

        },

        concurrent: {
            //同时执行这两个任务
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.option('force', true);

    grunt.registerTask('default', ['concurrent']);
}