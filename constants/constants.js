export const energyTypes = [
  {
    label: "Photovoltaïque",
    value: "energie_produite_annuelle_photovoltaique_enedis_mwh",
  },
  { label: "Éolien", value: "energie_produite_annuelle_eolien_enedis_mwh" },
  {
    label: "Hydraulique",
    value: "energie_produite_annuelle_hydraulique_enedis_mwh",
  },
  {
    label: "Bioénergie",
    value: "energie_produite_annuelle_bio_energie_enedis_mwh",
  },
  {
    label: "Cogénération",
    value: "energie_produite_annuelle_cogeneration_enedis_mwh",
  },
];

export const energyGreyTypes = ["Nucléaire", "Thermique fossile"];

export const colorMap = {
  Photovoltaïque: "#FFB400",
  Éolien: "#FF7C00",
  Hydraulique: "#4DA6FF",
  Bioénergie: "#00CC99",
  Cogénération: "#0078D7",
  Nucléaire: "#E74C3C",
  "Thermique fossile": "#C0392B",
  "Ensemble des énergies renouvelables": "#FFD700",
  "Ensemble des énergies grises": "#6C3483",
};
