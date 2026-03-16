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
                sh 'docker build -t supermarket-app ./backend'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker stop supermarket-app || true'
                sh 'docker rm supermarket-app || true'
                sh 'docker run -d -p 5000:5000 --name supermarket-app supermarket-app'
            }
        }

    }
}
