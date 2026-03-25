import morgan from 'morgan';
import App from './App';

const port = process.env.PORT || 4000;

App.use(morgan('dev'));

App.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
