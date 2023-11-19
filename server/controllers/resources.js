import { pool } from "../database/db.js";


export async function allResources(req, res) {
  let [resources] = await pool.query(
    `SELECT
    recurso.*, auditorio.aforo, aula.cantidad_puestos, aula.material_puestos, patio.tipo_patio,
    horario_recurso.dia, horario_recurso.hora_inicio, horario_recurso.hora_cierre
    from recurso 
    LEFT JOIN auditorio ON recurso.pk_id_recurso = auditorio.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = auditorio.pk_fk_num_unidad 
    LEFT JOIN aula ON recurso.pk_id_recurso = aula.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = aula.pk_fk_num_unidad 
    LEFT JOIN patio ON recurso.pk_id_recurso = patio.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = patio.pk_fk_num_unidad
    INNER JOIN horario_recurso ON horario_recurso.fk_num_unidad = recurso.pk_fk_num_unidad
    AND horario_recurso.fk_id_recurso = recurso.pk_id_recurso;`);

  const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  let simplifiedResources = []
  resources = resources.map((resource)=>{
    let lastResource = simplifiedResources[simplifiedResources.length-1];
    let scheduleKey = weekDays[resource.dia-1]
    if(simplifiedResources.length == 0 || lastResource.id != resource.pk_id_recurso){
      let simplified = {
        id: resource.pk_id_recurso,
        unidNumber: resource.pk_fk_num_unidad,
        name: resource.nombre,
        description: resource.descripcion,
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
      simplified.schedule = {};
      lastResource = simplified
      simplifiedResources.push(simplified)
    }
    lastResource.schedule[scheduleKey] = {start: resource.hora_inicio, end: resource.hora_cierre}
  })
  
  return res.status(200).json(simplifiedResources);

}