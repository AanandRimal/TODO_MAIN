const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/download', (req, res) => {
    const filePath = req.query.filePath; // Get the file path from the query parameter

  
    if (!filePath) {
      return res.status(400).json({ error: 'File path is missing' });
    }
  
    // Read the file from the server
    fs.readFile(filePath, (err, data) => { 
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Failed to read file' });
      }
  
      // Set the appropriate headers for the file download
      res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`); // we wrote this inorder not to display in browser rather to make as attachemnt to download
      res.setHeader('Content-Type', 'application/octet-stream'); // we are sending as octet stream for binary data 
  
      // Send the file data as the response
      res.send(data);
    });
  });
  
  module.exports = router;