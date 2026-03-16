pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '/usr/local/bin/docker build -t supermarket-app ./backend'
            }
        }

        stage('Run Container') {
            steps {
                sh '/usr/local/bin/docker stop supermarket-app || true'
                sh '/usr/local/bin/docker rm supermarket-app || true'
                sh '/usr/local/bin/docker run -d -p 5000:5000 --name supermarket-app supermarket-app'
            }
        }

    }
}
