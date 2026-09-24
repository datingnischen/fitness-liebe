import { formatMinutes, getRecipeTotalMinutes, type Recipe } from "@/lib/recipes";
import "./recipe-card.css";

export function RecipeHeroFacts({ recipe }: { recipe: Recipe }) {
  return (
    <div className="recipe-hero-facts">
      <span>⏱️ {formatMinutes(getRecipeTotalMinutes(recipe))}</span>
      <span>🍽️ {recipe.servingsLabel}</span>
      <span>👌 {recipe.difficulty}</span>
      {recipe.vegetarian ? <span>🌱 Vegetarisch</span> : null}
      <a className="recipe-hero-jump" href="#rezept">
        Direkt zum Rezept <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const facts = [
    { label: "Vorbereitung", value: formatMinutes(recipe.prepMinutes) },
    { label: "Kochzeit", value: formatMinutes(recipe.cookMinutes) },
    ...(recipe.restMinutes ? [{ label: "Ziehzeit", value: formatMinutes(recipe.restMinutes) }] : []),
    { label: "Gesamt", value: formatMinutes(getRecipeTotalMinutes(recipe)), highlight: true },
    { label: "Portionen", value: recipe.servingsLabel },
    { label: "Schwierigkeit", value: recipe.difficulty },
    { label: "Pro Portion", value: `ca. ${recipe.caloriesPerServing} kcal` },
  ];

  return (
    <section className="recipe-card" id="rezept" aria-labelledby="rezept-titel">
      <header className="recipe-card-head">
        <span className="eyebrow eyebrow-brand">🧑‍🍳 Rezept</span>
        <h2 id="rezept-titel">{recipe.name}</h2>
        <dl className="recipe-card-facts">
          {facts.map((fact) => (
            <div key={fact.label} className={fact.highlight ? "is-highlight" : undefined}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="recipe-card-body">
        <div className="recipe-card-ingredients">
          <h3>Zutaten <small>für {recipe.servingsLabel}</small></h3>
          {recipe.ingredientGroups.map((group) => (
            <div key={group.title} className="recipe-ingredient-group">
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item.name}>
                    <label>
                      <input type="checkbox" />
                      <span>
                        {item.amount ? <strong>{item.amount}</strong> : null} {item.name}
                        {item.note ? <em>, {item.note}</em> : null}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="recipe-card-hint">Tipp: Zutaten antippen, um sie beim Einkaufen oder Kochen abzuhaken.</p>
        </div>

        <div className="recipe-card-steps">
          <h3>Zubereitung</h3>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={step.title} id={`rezept-schritt-${index + 1}`}>
                <span className="recipe-step-number" aria-hidden="true">{index + 1}</span>
                <div>
                  <h4>
                    {step.title}
                    {step.minutes ? <span className="recipe-step-time">⏱️ {formatMinutes(step.minutes)}</span> : null}
                  </h4>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="recipe-card-note">
        Kalorien grob geschätzt bei {recipe.servings} Portionen – je nach Zutaten und Portionsgröße weicht der Wert ab.
      </p>
    </section>
  );
}
