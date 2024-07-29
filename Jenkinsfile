pipeline {
    agent none
    stages {
        stage('Deliver for development') {
            when {
                branch 'develop'
            }
            agent {
                label 'desarrollo-vistas'
            }
            steps {
                echo 'Install dependencies'
                sh 'npm install --force'
                echo 'Building app'
                sh 'npm run build-dev'
                echo 'Symlink app'
                sh 'ln -s /home/jenkins/vistas/workspace/${PWD##*/}/dist /usr/share/nginx/html/<url_context>'
                echo 'Delete code (except dist)'
                cleanWs deleteDirs: true, patterns: [[pattern: 'dist/**', type: 'EXCLUDE']]
            }
        }
    }
}
