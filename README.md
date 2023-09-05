
# ticket.io-Testapplication

Das Ziel der Testaufgabe war es ein simples Frontend und Backend zu entwickeln, dass eine es ermöglicht die Entitäten TIckets und Events zu verwalten.
Die REST-API ist der von [Directus](https://docs.directus.io/reference/filter-rules.html) nachempfunden und bietet Vorteile durch ihre Flexibilität.

## Technologien / Tools
- Node.js
- TypeScript
- Nest.js
- knex
- sqlite3
- React mit MUI
- Turbo

## Entwicklungsstrategien
- API-first
- Monorepo

## API
Die API und die Controller sind stark denen aus dem Directus Projekt nachempfunden.
Jedoch in schlankerer Form. Bspw. entfällt die Ausgabe von 02M/M2M relationalen Objekten.

### Create item

```http
  POST /api/:collection
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Body`      | `JSON` | **Required**. Payload which represents the new item |

```
  Result Item with all column keys of the selected collection
```


### Get all items / by Query
```http
  GET /api/:collection
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fields` | `Array/JSON` | Array an felder |
| `filter` | `JSON` | Filter Objekt  |
| `sort` | `string` | Key nach dem sortiert werden soll |
| `limit` | `number` | Anzahl der zurückzugebenden EInträge |
| `page` | `number` | Seite |
| `offset` | `number` | Offset |

```
  Result: Item[] das nach den gegebenen Kriterien gefilter wurde.
```
#### Query Beispiele

Die Komplexität des Filter ist der von [Directus](https://docs.directus.io/reference/filter-rules.html) nachempfunden. Weitere Referenzen finden man auf der verlinkten Dokumentationsseite. 

```JSON

GET /api/tickets?fields=fields

null | [] | ["*"] | ["id","firstName", ...]


Pagination mit Sortierung GET /api/events?sort=-title&limit=10&page=1&offset=1

GET /api/events?filter=filter

{
   "_and":[
      {
         "eventId":{
            "_eq":"cc45dbf0-99f4-4e74-adc0-ab3438ee8db2"
         }
      },
	  {
		"firstName":{
            "_eq":"Andrea"
        }
	  }
   ]
}
```

### Get item

```http
  GET /api/:collection/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `UUID` | **Required**. Id of item to fetch |

```
  Result Item with all column keys of the selected collection
```

### Update item

```http
  PATCH /api/:collection/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `UUID` | **Required**.  Id of item to fetch  |
| `Body`      | `JSON` | **Required**.  Payload which represents Partial of item |

```
  Result Item with all column keys of the selected collection
```

### Delete item

```http
  DELETE /api/:collection/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `UUID` | **Required**.  Id of item to delete from database  |

```
  Result string[] which is an Array with removed ids
```

## Lokale installation

### Voraussetzungen
- Node v18.17.0 & npm

#### Anleitung / Setup
Klonen der Repository

`git clone https://github.com/bytesnackscgn/ticket-testapplication.git`

#### Single Command Setup
Das Setup-Script installiert in allen workspaces die erforderlichen Abhängigkeiten. Gefolgt durch das Aufsetzen der sqlite3-Datenbank, Migrationen und Seeds. Die Seed-Scripte erstellen 10 Events und 100 Tickets die randomisiert den jeweiligen Events zugeordnet werden. 

`npm run setup`

Sollte es an der ein oder anderen Stelle scheitern können die scripte wie folgt auch nacheinander aufgerufen werden

```
npm run install-all

db:migrate:dev

db:seed:dev
```
#### Development
Starten des dev servers
Die API ist über http://localhost:3001/api erreichbar;
Das Frontend ist über http://localhost:5173 erreichbar;

```
development with watcher: npm run dev

build with dev env: npm run build:dev
build with production env: npm run build

run the builded module: npm run start
```


## Deployement
Eine vorgesehene Deployement Strategie mittels Containerisierung der einzelnen Services wurde nicht integriert.

