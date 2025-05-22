import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const AppList = () => {
  const [apps, setApps] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [error, setError] = useState('');

  const fetchApps = async () => {
    try {
      const response = await axios.get('/api/apps');
      setApps(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des applications');
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreateApp = async () => {
    try {
      await axios.post('/api/apps', { name: newAppName });
      setOpen(false);
      setNewAppName('');
      fetchApps();
    } catch (error) {
      setError('Erreur lors de la création de l\'application');
    }
  };

  const handleDeleteApp = async (id) => {
    try {
      await axios.delete(`/api/apps/${id}`);
      fetchApps();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'application');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Applications</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Nouvelle Application
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {apps.map((app) => (
          <Grid item xs={12} md={6} lg={4} key={app._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {app.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-all' }}>
                    Token: {app.token}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(app.token)}
                    title="Copier le token"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteApp(app._id)}
                    title="Supprimer l'application"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nouvelle Application</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de l'application"
            fullWidth
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateApp} color="primary">
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppList; 