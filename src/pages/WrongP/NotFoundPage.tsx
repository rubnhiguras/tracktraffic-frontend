import React from 'react';
//import { useNavigate } from 'react-router-dom'; 
import { Box, Card, CardContent, FormControl } from '@mui/material';
import DoDisturbOnRounded from '@mui/icons-material/DoDisturbOnRounded';
import packageJson from '../../../package.json';
import { red } from '@mui/material/colors';

const NotFoundPage: React.FC = () => {
  document.title = document.title = packageJson.title + ' ' + '404';

  return (
    <Card id="logincard" sx={{ marginTop: 0.4, minWidth: 100, borderRadius: "40px" }}>

      <CardContent>
        <DoDisturbOnRounded sx={{ color: red[800], fontSize: 90 }} />
        <h2>&nbsp;Página&nbsp;no&nbsp;encontrada</h2>
        <Box sx={{ minWidth: 99 }}>
          <FormControl component="form" sx={{ '& > :not(style)': { m: 0.4, width: '28ch' }, }}
            autoComplete="off"
          >
            <div>
              <p>
                ¡Ups!&nbsp;Este&nbsp;sitio&nbsp;no&nbsp;está&nbsp;disponible.
                Pulsa&nbsp;<a href='/'>aquí</a>&nbsp;para&nbsp;ir&nbsp;al&nbsp;inicio.
              </p>
            </div>
          </FormControl>

        </Box>
      </CardContent>
    </Card>
  );
};

export default NotFoundPage;

