pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker-compose down --remove-orphans || true'
                sh 'docker stop supermarket-backend supermarket-frontend || true'
                sh 'docker rm -f supermarket-backend supermarket-frontend || true'
                sh 'docker-compose up -d'
            }
        }

    }
}
