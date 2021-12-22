import db from '../database/models';
import Sequelize from 'sequelize';
import Response from '../helpers/Response';
import search from './Helper';

const Op = Sequelize.Op;
const { User, Note } = db;

class NoteController {
  static async createNote(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const { note, menteeId } = req.body;
      const noteCreated = await Note.create({
        note,
        attachment: req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null,
        mentorId: userId,
        menteeId
      });

      if(!noteCreated){
        const response = new Response(
          false,
          400,
          'Could not save, try again!'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        false,
        201,
        'Created Successfully'
      );
      return res.status(response.code).json(response);


    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getNotes(req, res){
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;

      const { menteeId } = req.params;

      const notes = await Note.findAll(
        {
          where: {
            [Op.or]: [ {mentorId: userId, menteeId}, {menteeId: userId, mentorId: menteeId} ]
          },
          include: [
            { model: User, as: 'mentor' },
            { model: User, as: 'mentee'}
          ]
        }
      );

      if(!notes.length){
        const response = new Response(
          false,
          400,
          'No note found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Notes successfully retrieved',
        { notes }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
}

export default NoteController;
