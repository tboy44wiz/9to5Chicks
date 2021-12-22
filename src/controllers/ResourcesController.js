import db from '../database/models';
import Sequelize from 'sequelize';
import Response from '../helpers/Response';

const { Resource } = db;

class ResourcesController {
  static async create(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const {
        title,
        type,
        description,
        link
      } = req.body;

      let resource;
      if(type === 'pdf' || type === 'worksheets' || type === 'templates' || type === 'articles'){
        if(req.files) {
          resource = await Resource.create({
            userId,
            ...req.body,
            image: `http://${req.headers.host}/uploads/${req.files['image'][0].filename}`,
            link: req.files['link'] ? `http://${req.headers.host}/uploads/${req.files['link'][0].filename}` : null,
          })
        } else {
          resource = await Resource.create({ ...req.body });
        }
      } else {
        resource = await Resource.create({ ...req.body });
        // if(req.files) {
        //   resource = await Resource.create({
        //     userId,
        //     ...req.body,
        //     image: `http://${req.headers.host}/uploads/${req.file.filename}`,
        //   })
        // } else {
        //   resource = await Resource.create({ ...req.body });
        // }
      }
      

      if(!resource){
        const response = new Response(
          false,
          400,
          'Error!, could not save',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Saved Successfully',
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

  static async get(req, res){
    try{
      const { id } = req.params;
      const resource = await Resource.findOne({ where: { id } });

      if(!resource){
        const response = new Response(
          false,
          400,
          'No resource found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Retrieved Successfully',
        { resource }
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

  static async getAllByType(req, res){
    try{
      const { type } = req.query;

      const resources = await Resource.findAll({ where: { type } });

      if(!resources.length){
        const response = new Response(
          false,
          400,
          'No resource found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Retrieved Successfully',
        { resources }
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

  static async getAll(req, res){
    try{
      const resources = await Resource.findAll();

      if(!resources.length){
        const response = new Response(
          false,
          400,
          'No resource found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Retrieved Successfully',
        { resources }
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
      const { type } = req.body;

      let resource;
      if(type === 'pdf' || type === 'worksheets' || type === 'templates' || type === 'articles'){
        if(req.files) {
          resource = await Resource.update(
            {
              ...req.body,
              image: `http://${req.headers.host}/uploads/${req.files['image'][0].filename}`,
              link: req.files['link'] ? `http://${req.headers.host}/uploads/${req.files['link'][0].filename}` : null,
            },
            { where: { id } }
          )
        } else {
          resource = await Resource.update(
            { ...req.body },
            { where: { id } }
          );
        }
      } else {
        resource = await Resource.update(
          { ...req.body },
          { where: { id } }
        );
      }

      if(!resource){
        const response = new Response(
          false,
          400,
          'Error!, could not update',
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
  
  static async delete(req, res){
    try{
      const { id } = req.params;
      const resource = await Resource.destroy({ where: { id } });

      if(!resource){
        const response = new Response(
          false,
          400,
          'Error!, could not delete',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Deleted Successfully',
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

export default ResourcesController;
