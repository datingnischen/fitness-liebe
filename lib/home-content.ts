// Redaktionelle Texte der bisherigen ICONY-Startseite von fitness-liebe.de.

export type HomeTextSection = { heading: string; paragraphs: string[] };

export const HOME_INTRO: HomeTextSection = {
  heading: "Partnervermittlung für Fitness-Fans",
  paragraphs: [
    "Gehörst Du zu den Menschen, denen ein gesunder Lifestyle wichtig ist? Du möchtest Deinen Alltag aktiv gestalten und wünschst Dir eine/n motivierten und fitten Partner/Partnerin an Deiner Seite? Dann bist du hier genau richtig.",
    "Bei Fitness-Liebe.de triffst Du auf Menschen mit gleichen Interessen und Vorlieben, rund um ein fittes und gesundes Leben. Nimm Dein Glück aktiv in die Hand und finde bei uns eine ernsthafte und langfristige Beziehung.",
  ],
};

export const HOME_SECTIONS: HomeTextSection[] = [
  {
    heading: "Bewegung macht glücklich",
    paragraphs: [
      "Regelmäßige Bewegung ist wichtig für das Wohlbefinden und ein gutes Körpergefühl. Dabei muss es nicht immer Leistungssport oder ein hartes Training sein. Auch Wandern, Schwimmen, Radfahren, Spazieren gehen oder kleine Workouts reichen schon aus, damit Du Dich richtig gut fühlst. Für Dich ist es daher wichtig, einen ebenso aktiven Menschen an deiner Seite zu haben.",
      "Gemeinsame Hobbys schaffen dauerhaft eine glückliche Beziehung. Was bringt es Dir, wenn Du Deinen Partner/deine Partnerin Tag für Tag dazu motivieren musst, sich aufzuraffen? Über kurz oder lang bringen solche grundlegenden Unterschiede in der Partnerschaft Probleme mit sich. Wir möchten bei Fitness-Liebe.de deshalb passende Singles zusammenbringen, die langfristig glücklich miteinander sind und ihre Freizeit gemeinsam genießen.",
    ],
  },
  {
    heading: "Wie wichtig sind gemeinsame Hobbys in der Partnerschaft?",
    paragraphs: [
      "Die Freizeit gemeinsam zu verbringen, macht nur dann Spaß, wenn beide Freude an den gemeinschaftlichen Aktivitäten haben. Daher ist es optimal, wenn beide Partner die gleichen Hobbys teilen. Schließlich möchtet Ihr gemeinsam etwas erleben und zusammen Erinnerungen schaffen, anstatt immer allein loszuziehen.",
      "Wenn Dein/e Partner/in die Leidenschaft für Fitness und Bewegung teilt, wird er/sie viel mehr Toleranz und Verständnis für Dich zeigen. Vielleicht hältst Du Dich an einen strikten Ernährungsplan oder es ist Dir wichtig, täglich ins Fitness-Studio zu gehen. Ein fitnessbegeisterter Partner wird Dich hierbei unterstützen und Deine Fortschritte interessiert mitverfolgen.",
    ],
  },
  {
    heading: "Passt ein Couch-Potato zu dir?",
    paragraphs: [
      "Gegen einen gemütlichen Filmabend und eine Pizza auf der Couch ist sicher nichts einzuwenden – aber es wird Dir vermutlich schnell langweilig, wenn jeden Tag nur Entspannen und Fast Food auf dem Programm stehen. Am Anfang bemühen sich beide und passen sich frisch verliebt an den anderen an. Nach einer gewissen Zeit sorgt das jedoch für Frust auf beiden Seiten.",
      "Egal welche Arten von Sport oder Bewegung bei Dir Begeisterung wecken: Wenn Dein Partner/Deine Partnerin gar nichts dafür übrig hat, wirst Du zwangsläufig weniger Möglichkeiten haben, Deinen Hobbys nachzugehen.",
    ],
  },
  {
    heading: "Gleich = Glücklich?",
    paragraphs: [
      "Jeder hat schon einmal den Spruch gehört „Gegensätze ziehen sich an“. Dennoch bieten unterschiedliche Ansichten und Hobbys auf Dauer großes Konfliktpotential. Paare, die einen ähnlichen Lebensstil führen, bleiben länger zusammen. Auf längere Sicht passt für langfristige Beziehungen daher das Sprichwort „Gleich und Gleich gesellt sich gerne“ deutlich besser.",
    ],
  },
  {
    heading: "So sind die Fitnessliebenden",
    paragraphs: [
      "Sport und Bewegung helfen nicht nur dem Körper, sondern tun auch der Seele gut. Fitnessbegeisterte Menschen sind häufig ausgeglichener und haben gute Laune – dank Endorphinen, die wir als Glückshormone kennen. Aktive Menschen sind im Alltag belastbarer und leicht für spaßige Aktivitäten und Ausflüge zu begeistern.",
      "Wer fit und gesund durchs Leben geht, hat ein gutes Körperbewusstsein und Selbstwertgefühl. Sport und Bewegung halten jung – das bedeutet mehr gemeinsame Zeit mit Deinem Traumpartner/Deiner Traumpartnerin.",
    ],
  },
  {
    heading: "Warum Fitness-Liebe.de?",
    paragraphs: [
      "Für Fitnessliebende ist eine Partnervermittlung vorteilhaft, bei der sie auf gleichgesinnte, fitnessbegeisterte und aktive Menschen stoßen. Hier können sich Menschen begegnen, denen ein aktiver und gesunder Alltag wichtig ist. Für flüchtige Flirts und Affären ist bei Fitness-Liebe.de kein Platz.",
      "Mit unserem Fitness-Magazin sind wir mehr als nur eine reine Singlebörse: Bei uns findest du Tipps und Ratgeber zu Muskelaufbau und Ernährung, Cardio-Training oder Training im Homeoffice.",
    ],
  },
];

// Plattformseiten (ICONY) – absolute Links auf die Live-Domain.
export const HOME_TRUST_TILES = [
  {
    icon: "🛡️",
    title: "Sicherheit & Datenschutz",
    text: "Eine sichere Partnersuche mit maximalem Datenschutz steht für uns bei fitness-liebe.de an erster Stelle.",
    path: "/sicherheit-und-datenschutz.html",
  },
  {
    icon: "✅",
    title: "Redaktionelle Kontrolle",
    text: "Unser Supportteam prüft zu Deiner Sicherheit jedes Profil. Über 750.000 sind schon dabei und finden hier ihre neue Liebe.",
    path: "/redaktionelle-kontrolle.html",
  },
  {
    icon: "🎟️",
    title: "Basis-Mitgliedschaft",
    text: "Die Registrierung ist komplett kostenlos und Du kannst fitness-liebe.de auch mit einer Basis-Mitgliedschaft sehr umfangreich nutzen.",
    path: "/kostenlose-basis-mitgliedschaft.html",
  },
];

export const HOME_FEATURES = [
  {
    title: "Strand oder Berge?",
    label: "Fragenflirt",
    text: "Passen Eure Wünsche, Gedanken und Träume zusammen? Unser Persönlichkeitstest bringt Euch einander näher.",
    cta: "Mehr zum Fragenflirt",
    path: "/fragenflirt.html",
    image: "/home/fragenflirt.webp",
  },
  {
    title: "Fotoflirt",
    label: "Fotoflirt",
    text: "Für alle, denen häufiger mal die Worte fehlen: Finde mit dem Fotoflirt völlig unkompliziert Deinen Wunschflirt.",
    cta: "Mehr zum Fotoflirt",
    path: "/fotoflirt.html",
    image: "/home/fotoflirt.webp",
  },
  {
    title: "Video-Date",
    label: "Video-Date",
    text: "Verabrede Dich virtuell zu einem Date und lerne Deinen Traumpartner persönlich kennen – unkompliziert und sicher.",
    cta: "Wie unser Video-Date funktioniert",
    path: "/videodate.html",
    image: "/home/videodate.webp",
  },
];
