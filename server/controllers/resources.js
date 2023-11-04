import { pool } from "../database/db.js";


export async function allResources(req, res) {
  let [resources] = await pool.query(`SELECT
  recurso.*, auditorio.aforo, aula.cantidad_puestos, aula.material_puestos, patio.tipo_patio 
  from recurso 
  LEFT JOIN auditorio ON recurso.pk_id_recurso = auditorio.pk_fk_id_recurso 
    AND recurso.pk_fk_num_unidad = auditorio.pk_fk_num_unidad 
  LEFT JOIN aula ON recurso.pk_id_recurso = aula.pk_fk_id_recurso 
    AND recurso.pk_fk_num_unidad = aula.pk_fk_num_unidad 
  LEFT JOIN patio ON recurso.pk_id_recurso = patio.pk_fk_id_recurso 
    AND recurso.pk_fk_num_unidad = patio.pk_fk_num_unidad;`);

  resources = resources.map((resource)=>{
    let simplified = {
      id: resource.pk_id_recurso,
      unidNumber: resource.pk_fk_num_unidad,
      name: resource.nombre,
      description: resource.descripcion
    };
    if(resource.aforo){
      simplified.type = 'auditorium';
      simplified.aforo = resource.aforo;
    }
    else if(resource.material_puestos){
      simplified.type = 'classroom';
      simplified.chairMaterial = resource.material_puestos;
      simplified.chairAmount = resource.cantidad_puestos;
    }
    else {
      simplified.type = 'yard';
      simplified.yardType = resource.tipo_patio;
    }

    return simplified
  })
  
  return res.status(200).json(resources);

}