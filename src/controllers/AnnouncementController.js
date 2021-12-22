import db from '../database/models';
import Response from '../helpers/Response';

const { User, Announcement } = db;

class AnnouncementController {
  static async create(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const isCreate = await Announcement.create({ ...req.body, userId });
      if(!isCreate){
        const response = new Response(
          false,
          400,
          'Error!, Something went wrong',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Created Successfully',
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

  static async edit(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { id } = req.params;

      const isUpdated = await Announcement.update(
        { ...req.body },
        { where: { id, userId } }
      );

      if(!isUpdated){
        const response = new Response(
          false,
          400,
          'Error!, Something went wrong',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Updated Successfully',
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

  static async getOne(req, res){
    try{
      const { id } = req.params;

      const announcement = await Announcement.findOne({ where: { id } });

      if(!announcement){
        const response = new Response(
          false,
          400,
          'No record found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { announcement }
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

  static async getAll(req, res){
    try{
      const announcements = await Announcement.findAll();

      if(!announcements.length){
        const response = new Response(
          false,
          400,
          'No record found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { announcements }
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

  static async delete(req, res){
    try{
      const { id } = req.params;
      const announcement = await Announcement.destroy({ where: { id } });

      if(!announcement){
        const response = new Response(
          false,
          400,
          'Error!, Something went wrong',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully deleted',
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

export default AnnouncementController;
