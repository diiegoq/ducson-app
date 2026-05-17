import { Button, Card, CardContent, Typography } from '@mui/material';

export default function TestMUI() {
  return (
    <div style={{ padding: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Material UI Test
          </Typography>
          <Button variant="contained" color="primary">
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}