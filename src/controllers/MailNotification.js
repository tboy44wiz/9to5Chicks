import db from '../database/models';
import Response from '../helpers/Response';

const { EmailNotification } = db;

class MailNotification {
  static async getAll(req, res){
    try{
      const mails = await EmailNotification.findAll();
      if(!mails.length){
        const response = new Response(
          false,
          404,
          'No Mail Notification found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { mails }
      );
      return res.status(response.code).json(response);

    }catch(error){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async create(req, res){
    try{
      let mail;
      if(req.files){
        mail = await EmailNotification.create({
          ...req.body,
          image: `http://${req.headers.host}/uploads/${req.files['image'][0].filename}`,
         });
      } else {
        mail = await EmailNotification.create({ ...req.body });
      }
      
      if(!mail){
        const response = new Response(
          false,
          400,
          'Error! creating mail notification',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Successfully created',
        { mail }
      );
      return res.status(response.code).json(response);

    }catch(error){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async update(req, res){
    try{
      const { id } = req.params;
      let mail;
      if(req.files){
        mail = await EmailNotification.update(
          {
            ...req.body,
            image: `http://${req.headers.host}/uploads/${req.files['image'][0].filename}`,
          },
          { where: { id } }
        );
      } else {
        mail = await EmailNotification.update(
          { ...req.body },
          { where: { id } }
        );
      }
      
      if(!mail){
        const response = new Response(
          false,
          400,
          'Error! updating mail notification',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully updated',
        { mail }
      );
      return res.status(response.code).json(response);

    }catch(error){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
}

export default MailNotification;
