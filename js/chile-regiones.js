/*
  ielou.studio — Región → Ciudad → Comuna, Chile completo (16 regiones, 346 comunas).
  "Ciudad" no es una unidad administrativa oficial (Chile usa Región → Provincia →
  Comuna); acá agrupa comunas por su conurbación/capital provincial más conocida,
  para que el selector de checkout sea más fácil de usar que una lista plana de
  346 comunas. Se usa en checkout.html vía js/main.js (initCheckoutForm).
*/
const CHILE_REGIONES = {
  "Región de Arica y Parinacota": {
    "Arica": ["Arica", "Camarones"],
    "Altiplano (Putre)": ["Putre", "General Lagos"]
  },
  "Región de Tarapacá": {
    "Iquique": ["Iquique", "Alto Hospicio"],
    "Provincia del Tamarugal": ["Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
  },
  "Región de Antofagasta": {
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal"],
    "Calama": ["Calama", "Ollagüe", "San Pedro de Atacama"],
    "Tocopilla": ["Tocopilla", "María Elena"]
  },
  "Región de Atacama": {
    "Copiapó": ["Copiapó", "Caldera", "Tierra Amarilla"],
    "Chañaral": ["Chañaral", "Diego de Almagro"],
    "Vallenar": ["Vallenar", "Freirina", "Huasco", "Alto del Carmen"]
  },
  "Región de Coquimbo": {
    "La Serena - Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña"],
    "Ovalle": ["Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Illapel": ["Illapel", "Canela", "Los Vilos", "Salamanca"]
  },
  "Región de Valparaíso": {
    "Gran Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Casablanca", "Puchuncaví", "Quintero", "Quilpué", "Villa Alemana", "Limache", "Olmué", "Juan Fernández"],
    "San Antonio": ["San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo"],
    "Quillota": ["Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales"],
    "San Felipe": ["San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María"],
    "Los Andes": ["Los Andes", "Calle Larga", "Rinconada", "San Esteban"],
    "La Ligua": ["La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar"],
    "Isla de Pascua": ["Isla de Pascua"]
  },
  "Región Metropolitana de Santiago": {
    "Gran Santiago": [
      "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central",
      "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana",
      "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú",
      "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura",
      "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura",
      "Puente Alto", "Pirque", "San José de Maipo", "San Bernardo", "Buin", "Calera de Tango",
      "Paine", "Padre Hurtado", "Peñaflor", "Colina", "Lampa", "Tiltil"
    ],
    "Melipilla": ["Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro"],
    "Talagante": ["Talagante", "El Monte", "Isla de Maipo"]
  },
  "Región de O'Higgins": {
    "Rancagua": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente"],
    "San Fernando": ["San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Pichilemu": ["Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones"]
  },
  "Región del Maule": {
    "Talca": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael"],
    "Curicó": ["Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén"],
    "Linares": ["Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Cauquenes": ["Cauquenes", "Chanco", "Pelluhue"]
  },
  "Región de Ñuble": {
    "Chillán": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Quillón", "San Ignacio", "Yungay"],
    "San Carlos": ["San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
    "Quirihue": ["Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Treguaco"]
  },
  "Región del Biobío": {
    "Gran Concepción": ["Concepción", "Chiguayante", "Coronel", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé"],
    "Los Ángeles": ["Los Ángeles", "Alto Biobío", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel"],
    "Arauco": ["Arauco", "Cañete", "Contulmo", "Curanilahue", "Lebu", "Los Álamos", "Tirúa"]
  },
  "Región de La Araucanía": {
    "Temuco": ["Temuco", "Padre Las Casas", "Cholchol", "Vilcún", "Freire", "Cunco", "Melipeuco", "Curarrehue", "Pucón", "Villarrica", "Loncoche", "Gorbea", "Toltén", "Teodoro Schmidt", "Nueva Imperial", "Carahue", "Saavedra", "Galvarino", "Lautaro", "Perquenco", "Pitrufquén"],
    "Angol": ["Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
  },
  "Región de Los Ríos": {
    "Valdivia": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli"],
    "La Unión": ["La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
  },
  "Región de Los Lagos": {
    "Puerto Montt": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas"],
    "Castro (Chiloé)": ["Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi"],
    "Osorno": ["Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
    "Chaitén": ["Chaitén", "Futaleufú", "Hualaihué", "Palena"]
  },
  "Región de Aysén": {
    "Coyhaique": ["Coyhaique", "Lago Verde"],
    "Puerto Aysén": ["Aysén", "Cisnes", "Guaitecas"],
    "Chile Chico": ["Chile Chico", "Río Ibáñez"],
    "Cochrane": ["Cochrane", "O'Higgins", "Tortel"]
  },
  "Región de Magallanes y de la Antártica Chilena": {
    "Punta Arenas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio"],
    "Puerto Natales": ["Puerto Natales", "Torres del Paine"],
    "Porvenir": ["Porvenir", "Primavera", "Timaukel"],
    "Cabo de Hornos": ["Cabo de Hornos", "Antártica"]
  }
};
