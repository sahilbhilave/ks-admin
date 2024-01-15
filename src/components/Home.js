// Install necessary packages:
// npm install react react-dom react-router-dom axios

// Home.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

const clientId = 'YOUR_GITHUB_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const githubApiUrl = 'https://api.github.com';

const Home = () => {
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('githubToken');
    if (storedToken) {
      setToken(storedToken);
      fetchRepos(storedToken);
    }
  }, []);

  const fetchRepos = async (accessToken) => {
    try {
      const response = await axios.get(`${githubApiUrl}/user/repos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRepos(response.data);
    } catch (error) {
      console.error('Error fetching repositories', error);
    }
  };

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  };

  const handleLogout = () => {
    setToken('');
    setRepos([]);
    setCurrentRepo('');
    setFiles([]);
    setSelectedFile('');
    setFileContent('');
    localStorage.removeItem('githubToken');
  };

  const handleRepoSelect = (repo) => {
    setCurrentRepo(repo);
    fetchFiles(repo);
  };

  const fetchFiles = async (repo) => {
    try {
      const response = await axios.get(`${githubApiUrl}/repos/${repo.full_name}/contents/`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    try {
      const response = await axios.get(file.download_url);
      setFileContent(response.data);
    } catch (error) {
      console.error('Error fetching file content', error);
    }
  };

  const handleFileContentChange = (content) => {
    setFileContent(content);
  };

  const handleCommitAndPublish = async () => {
    try {
      const response = await axios.put(
        `${githubApiUrl}/repos/${currentRepo.full_name}/contents/${selectedFile.path}`,
        {
          message: 'Update via website',
          content: btoa(fileContent), // Base64 encode content
          sha: selectedFile.sha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Commit response', response);
    } catch (error) {
      console.error('Error committing changes', error);
    }
  };

  if (!token) {
    return (
      <div>
        <p>Please login to GitHub to access the Home.</p>
        <button onClick={handleLogin}>Login with GitHub</button>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <button onClick={handleLogout}>Logout</button>
        <h2>Repositories</h2>
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link to={`/repos/${repo.name}`} onClick={() => handleRepoSelect(repo)}>
                {repo.name}
              </Link>
            </li>
          ))}
        </ul>
        <Route
          path="/repos/:repoName"
          render={({ match }) => (
            <div>
              <h3>Files</h3>
              <ul>
                {files.map((file) => (
                  <li key={file.sha}>
                    <Link to={`/repos/${match.params.repoName}/${file.name}`} onClick={() => handleFileSelect(file)}>
                      {file.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        />
        <Route
          path="/repos/:repoName/:fileName"
          render={({ match }) => (
            <div>
              <h3>Edit File</h3>
              <textarea value={fileContent} onChange={(e) => handleFileContentChange(e.target.value)}></textarea>
              <button onClick={handleCommitAndPublish}>Commit and Publish</button>
            </div>
          )}
        />
      </div>
    </Router>
  );
};

export default Home;
