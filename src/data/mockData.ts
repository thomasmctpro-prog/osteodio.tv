export interface Track {
  id: number;
  title: string;
  duration: string;
  episode: string;
  image: string;
  audioUrl?: string;
  category: "osteopathie" | "bonus";
  description?: string;
}

export const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "osteopathie", label: "Ostéopathie" },
  { id: "bonus", label: "Bonus" },
] as const;

export const INITIAL_PODCASTS: Track[] = [
  {
    id: 1,
    title: "La machinerie biologique de la locomotion équine",
    duration: "30 min",
    episode: "Ép. 1",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop",
    audioUrl: "./audio/Ep-1-La_machinerie_biologique_de_la_locomotion_équine.mp3",
    category: "osteopathie",
    description: "Découvrez les mécanismes biologiques fascinants qui permettent la locomotion du cheval."
  },
  {
    id: 2,
    title: "La mécanique de précision de l'anatomie équine",
    duration: "27 min",
    episode: "Ép. 2",
    image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400&h=400&fit=crop",
    audioUrl: "./audio/Ep-2-La_mécanique_de_précision_de_l_anatomie_équine.mp3",
    category: "osteopathie",
    description: "Plongée au cœur de l'anatomie équine et de ses rouages mécaniques de précision."
  },
  {
    id: 3,
    title: "Anatomie équine : entre Auzoux et horse painting",
    duration: "25 min",
    episode: "Ép. 3",
    image: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=400&h=400&fit=crop",
    audioUrl: "./audio/Ep-3-Anatomie_équine_entre_Auzoux_et_horse_painting.mp3",
    category: "osteopathie",
    description: "L'anatomie équine vue à travers l'art et la science, d'Auzoux au horse painting."
  },
  {
    id: 4,
    title: "Paris, les frères ennemis",
    duration: "48 min",
    episode: "Bonus",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=400&fit=crop",
    audioUrl: "./audio/Paris, les frères ennemis.mp3",
    category: "bonus",
    description: "Épisode bonus hors-série : une plongée passionnante dans la rivalité parisienne du football."
  }
];

export const VIDEOS = [
  {
    id: 1,
    title: "Technique de thrust cervical",
    views: "12k vues",
    duration: "12:45",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop"
  },
  {
    id: 2,
    title: "Examen clinique du cheval",
    views: "8.5k vues",
    duration: "24:10",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=450&fit=crop"
  },
  {
    id: 3,
    title: "Bases de l'anatomie canine",
    views: "15k vues",
    duration: "18:30",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=450&fit=crop"
  }
];

export const LEARNING_PATHS = [
  {
    id: 1,
    tag: "Masterclass",
    title: "Ostéopathie équine",
    stats: "12 Cours • 48 Leçons",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    tag: "Pratique",
    title: "Techniques bovines",
    stats: "8 Cours • 32 Leçons",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    tag: "Clinique",
    title: "Pratique canine",
    stats: "15 Cours • 60 Leçons",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop"
  }
];
