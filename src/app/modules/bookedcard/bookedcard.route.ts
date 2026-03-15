import express from 'express';
import { BookedcardController } from './bookedcard.controller';

const router = express.Router();

router.get('/', BookedcardController); 

export const BookedcardRoutes = router;
