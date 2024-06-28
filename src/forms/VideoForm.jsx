import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoForm.css';

const VideoForm = ({ initialVideoData }) => {
  const [players, setPlayers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [playerId, setPlayerId] = useState(initialVideoData?.player_id || '');
  const [videoUrl, setVideoUrl] = useState(initialVideoData?.video_url || '');
  const [description, setDescription] = useState(initialVideoData?.description || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (playerId) {
      fetchPlayerVideos();
    }
  }, [playerId]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/players`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchPlayerVideos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/video-highlights/player/${playerId}`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      player_id: playerId,
      video_url: videoUrl,
      description: description,
    };

    try {
      if (selectedVideoId) {
        // Update existing video
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/video-highlights/${selectedVideoId}`, formData);
      } else {
        // Create new video
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/video-highlights`, formData);
      }
      setSuccessMessage('Video added successfully');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchPlayerVideos(); // Refresh the videos after submitting
      handleClearForm(); // Clear the form after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to add video');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleEdit = (video) => {
    if (selectedVideoId === video.id) {
      handleClearForm(); // If the same video is clicked again, clear the form
    } else {
      setSelectedVideoId(video.id); // Set selectedVideoId for the video being edited
      setPlayerId(video.player_id);
      setVideoUrl(video.video_url);
      setDescription(video.description);
    }
  };

  const handleClearForm = () => {
    setSelectedVideoId(null); // Clear selectedVideoId
    setVideoUrl('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this video?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/video-highlights/${id}`);
      setSuccessMessage('Video deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchPlayerVideos(); // Refresh the videos after deleting
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="video-form-container">
      <form className="video-form-form" onSubmit={handleSubmit}>
        <div className="video-form-group">
          <label htmlFor="player">Player</label>
          <select
            id="player"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            required
          >
            <option value="">Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.first_name} {player.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="video-form-group">
          <label htmlFor="videoUrl">Video URL</label>
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
        </div>

        <div className="video-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="video-form-submit-button">Submit</button>
        {successMessage && (
          <div className="video-form-success-message">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="video-form-error-message">
            {errorMessage}
          </div>
        )}
      </form>
      <div className="video-form-right-side-content">
        <h2>Videos</h2>
        <ul className="video-form-video-list">
          {videos.map((video) => (
            <li key={video.id} className="video-form-video-item">
              <iframe
                src={getYoutubeEmbedUrl(video.video_url)}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p>{video.description}</p>
              <button onClick={() => handleEdit(video)}>
                {selectedVideoId === video.id ? 'Unedit' : 'Edit'}
              </button>
              <button onClick={() => handleDelete(video.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoForm;
