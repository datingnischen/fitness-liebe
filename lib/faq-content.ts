import { platformUrl, type MarketCode } from "#markets";

// Antworten stützen sich auf die Hilfe-Artikel der Plattform (https://fitness-liebe.de/hilfe/).
// Preise und Laufzeiten stehen bewusst nicht hier: Sie ändern sich und werden im Mitgliedschaftsbereich genannt.
// Plattformseiten (Hilfe, Kontakt, Login, Sicherheit) sind absolute Links auf die Live-Domain.

/** Schweizer Rechtschreibung: kein ß (wie localizeTexts in market-copy.ts, hier ohne Alias-Import für den Node-Test). */
function localizeTexts<T>(market: MarketCode, value: T): T {
  return market === "ch" ? (JSON.parse(JSON.stringify(value).replace(/ß/g, "ss")) as T) : value;
}

export type FaqItem = { question: string; answerHtml: string };
export type FaqSection = { id: string; title: string; items: FaqItem[] };

const link = (path: string, label: string) => `<a href="${platformUrl(path)}">${label}</a>`;

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "allgemeines",
    title: "Allgemeines zu fitness-liebe.de",
    items: [
      {
        question: "An wen richtet sich fitness-liebe.de?",
        answerHtml:
          "<p>fitness-liebe.de richtet sich an Menschen, die Bewegung und einen aktiven Lebensstil mögen und neue Leute kennenlernen möchten: für Freizeitpartner bei bestimmten Aktivitäten, für Flirts oder für eine feste Partnerschaft.</p>",
      },
      {
        question: "Kann ich fitness-liebe.de auch auf dem Smartphone nutzen?",
        answerHtml:
          "<p>Ja. fitness-liebe.de funktioniert auch unterwegs mit Smartphone oder Tablet so, wie du es vom Rechner kennst. Du kannst Nachrichten beantworten und deine Besucherliste ansehen.</p>",
      },
      {
        question: "Wie finde ich sportliche Singles in meiner Nähe?",
        answerHtml: `<p>Über die Suche auf der Plattform kannst du nach Postleitzahl und Umkreis suchen. Die Stadtseiten dieser Website geben dir zusätzlich Orientierung zu Laufstrecken, Parks und Trainingsorten. Zur ${link("/suche/", "Mitgliedersuche")}.</p>`,
      },
      {
        question: "Gibt es ein Magazin zu Fitness und Dating?",
        answerHtml:
          "<p>Ja. Im Magazin findest du Beiträge zu Training, Ernährung, Rezepten und Fitness-Dating. Die Artikel sind redaktionelle Informationen und ersetzen keine individuelle Beratung durch Ärztinnen, Ärzte oder Trainer.</p>",
      },
    ],
  },
  {
    id: "kosten-mitgliedschaft",
    title: "Kosten, Premium & Kündigung",
    items: [
      {
        question: "Ist die Registrierung kostenlos?",
        answerHtml: `<p>Ja. Die Registrierung samt Profil, große Teile der Suche, das Versenden von Smileys und der gesamte Fragenflirt sind kostenlos. Du kannst dich also unverbindlich umsehen. Mehr dazu in der ${link("/kostenlose-basis-mitgliedschaft.html", "Basis-Mitgliedschaft")}.</p>`,
      },
      {
        question: "Was bringt eine Premium-Mitgliedschaft?",
        answerHtml: `<p>Premium-Mitglieder können unter anderem beliebig viele Nachrichten an andere Mitglieder schreiben, Bilder versenden und alle Profilbesucher sehen. Eine Übersicht findest du unter ${link("/premium-mitgliedschaft.html", "Premium-Mitgliedschaft")}.</p>`,
      },
      {
        question: "Was kostet Premium und wie lange läuft es?",
        answerHtml:
          "<p>Es gibt Premium-Mitgliedschaften mit verschiedenen Laufzeiten, die Preise hängen von der gewählten Laufzeit ab. Aktuelle Preise und Laufzeiten siehst du in deinem Mitgliedschaftsbereich, bevor du buchst. Je nach Zahlungsmethode verlängert sich eine Mitgliedschaft automatisch. Das wird dir vor Abschluss der Buchung noch einmal mitgeteilt, und danach bekommst du eine Bestellbestätigung mit allen Details.</p>",
      },
      {
        question: "Welche Zahlungsarten gibt es?",
        answerHtml: "<p>Du kannst per Lastschrift, PayPal oder Kreditkarte bezahlen.</p>",
      },
      {
        question: "Wie kann ich meine Premium-Mitgliedschaft kündigen?",
        answerHtml: `<p>Du kündigst deine Premium-Mitgliedschaft in der Kontoverwaltung. Nach der Kündigung bekommst du eine Bestätigung an deine hinterlegte E-Mail-Adresse. Bei Fragen hilft der ${link("/hilfe/", "Support")}.</p>`,
      },
    ],
  },
  {
    id: "nachrichten-kontakt",
    title: "Nachrichten & Kontakt",
    items: [
      {
        question: "Wie schreibe ich jemandem eine Nachricht?",
        answerHtml:
          "<p>Die erste Nachricht schickst du über die Visitenkarte der Person: Unter dem Profilbild findest du einen Briefumschlag, den du anklickst. Alle gesendeten und empfangenen Nachrichten siehst du im Nachrichtenbereich. Um eine Nachricht an ein Mitglied mit kostenloser Mitgliedschaft zu schicken, brauchst du eine Premium-Mitgliedschaft.</p>",
      },
      {
        question: "Kann ich ohne Premium Nachrichten empfangen?",
        answerHtml:
          "<p>Ja. Ohne Premium-Mitgliedschaft kannst du Nachrichten von Premium-Mitgliedern empfangen, lesen und beantworten.</p>",
      },
    ],
  },
  {
    id: "profil-sicherheit",
    title: "Profil, Datenschutz & Sicherheit",
    items: [
      {
        question: "Muss ich mein Profil komplett ausfüllen?",
        answerHtml:
          "<p>Nein, du entscheidest selbst, was andere über dich erfahren. Je mehr Angaben deine Visitenkarte enthält, desto besser können andere dich einschätzen. Auf deiner Startseite siehst du, zu wie viel Prozent sie ausgefüllt ist.</p>",
      },
      {
        question: "Wer kann meine Visitenkarte sehen?",
        answerHtml:
          "<p>Die Details deiner Visitenkarte sehen nur registrierte und eingeloggte Mitglieder. Alle anderen sehen nur Benutzernamen, Profilfoto, Alter und ungefähren Wohnort.</p>",
      },
      {
        question: "Wie geht fitness-liebe.de mit meinen persönlichen Daten um?",
        answerHtml: `<p>Name, Anschrift und E-Mail-Adresse sind für andere Mitglieder nicht sichtbar, nur die Stadt und die ersten Ziffern der Postleitzahl. Die interne Nachrichtenbox ermöglicht den Austausch zwischen zwei Mitgliedern, ohne dass du Kontaktdaten preisgeben musst. Mehr unter ${link("/sicherheit-und-datenschutz.html", "Sicherheit &amp; Datenschutz")}.</p>`,
      },
      {
        question: "Was ist der Verifiziert-Status?",
        answerHtml:
          "<p>Der Verifiziert-Status zeigt anderen Mitgliedern, dass dein Profil verifiziert wurde. Er wird nach einer erfolgreichen ID-Verifizierung oder automatisch mit einer Premium-Mitgliedschaft vergeben.</p>",
      },
      {
        question: "Wie sollte ich mich auf fitness-liebe.de verhalten?",
        answerHtml: "<p>Wir möchten, dass sich alle wohlfühlen. Bitte verhalte dich freundlich und respektvoll gegenüber anderen Mitgliedern.</p>",
      },
    ],
  },
  {
    id: "konto-support",
    title: "Konto & Support",
    items: [
      {
        question: "Ich habe mein Passwort vergessen. Was tun?",
        answerHtml: `<p>Auf der ${link("/login/", "Login-Seite")} kannst du ein neues Passwort anfordern: Gib deinen Benutzernamen oder deine E-Mail-Adresse ein, klicke in der zugeschickten E-Mail auf den Link und lege ein neues Passwort fest.</p>`,
      },
      {
        question: "Wie erreiche ich den Support?",
        answerHtml: `<p>Bei Fragen oder Problemen schreibst du uns über das ${link("/kontakt/", "Kontaktformular")}. Weitere Antworten findest du in der ${link("/hilfe/", "Hilfe")}.</p>`,
      },
    ],
  },
];

export function faqCopy(market: MarketCode) {
  const region = { de: "", at: " in Österreich", ch: " in der Schweiz" }[market];
  const base = {
    title: `Häufige Fragen zu fitness-liebe.de${region} (FAQ)`,
    description: `Antworten zu Kosten, Nachrichten, Profil und Datenschutz bei fitness-liebe.de${region}, der Partnersuche für sportliche Singles.`,
    heading: "Häufige Fragen (FAQ)",
    lead: `Hier findest du die wichtigsten Antworten rund um fitness-liebe.de${region}: Kosten, Nachrichten, Profil und Datenschutz.`,
  };
  return localizeTexts(market, base);
}

export function faqSections(market: MarketCode): FaqSection[] {
  return localizeTexts(market, FAQ_SECTIONS);
}

/** Antworttext ohne HTML für das FAQPage-Schema. */
export function plainAnswer(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
