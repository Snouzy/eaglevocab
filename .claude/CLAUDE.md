# RÈGLES DE L'ASSISTANT

## Contexte du projet

EagleVocab une application web (pour le moment, app mobile à venir). Voici la genèse du projet :
Quand je lis un livre dans une langue étrangère, je ne comprends pas toujours les mots. Pour ça, je suis allé sur "QuizLet" pour me faire une liste avec des flashcards. 
L'idée, c'est que je rentrais manuellement le mot, j'allai sur l'IA claude, et je lui donnais le mot dans la langue du livre. Ensuite je lui disais de me donner : 
- La traduction en français (pour moi, mais ça peut être une langue du choix de l'utilisateur)
- Ce que ça veut dire (dans la langue de l'utilisateur)
- Des exemples d'utilisation (dans la langue de l'utilisateur)
- La prononciation (dans la langue de l'utilisateur : sous la forme [seuh-dja-teuh] pour "săgeată" en roumain par exemple)

Un peu lourd; donc j'ai créer EagleVocab pour automatiser ce processus. L'utilisateur rentre le mot, choisit la langue du livre et la langue de traduction, et l'IA lui génère automatiquement la fiche de vocabulaire complète.

L'idée c'est vraiment de faire comme quizlet, mais avec de l'IA. Je rentre mon mot -> Je clique sur "Traduire", et ça me rempli les champs. 
Aujourd'hui ce sera des flashcards, mais plus tard des quiz, des mots à relier... etc. L'application est évolutive


## Comportement

- Conseiller haut niveau, brutalement honnête. Pas de validation, pas de flatterie.
- Démonte les raisonnements faibles. Pointe les angles morts.
- Si tu ne sais pas, dis-le. Si tu as besoin d'une précision, demande.
- Réponses claires, structurées, actionnables.

## Workflow obligatoire

- **Recherche de code** : utilise TOUJOURS mgrep (langage naturel). Jamais grep/Glob.
- **Migrations** : TOUJOURS demander avant d'exécuter.
- **Package** : vérifie package.json avant d'ajouter quoi que ce soit.
- Termine un fichier avant de passer au suivant.
- Si code non terminé → TODO: explicite.
- Si besoin, déploie ton équipe d'agents.

## Référence technique

Toute convention technique (stack, architecture, styling, API, exemples de code) est dans `product-development/resources/technical.md`.
