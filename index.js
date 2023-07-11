const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());

app.get('/', (req, res) => {
    res.writeHead(200, { "Content-type": "application/json" })
    res.write('Hola, este es mi servidor con Express')
    return res.end()

});

app.get('/anime', (req, res) => {
    fs.readFile('anime.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500
            res.write('Error en el servidor');
        } else {
            const animes = JSON.parse(data);
            res.json(animes);
        }
    });
});

app.get('/anime/:id', (req, res) => {
    const clave = req.params.id; // Modifica la variable id a clave
    fs.readFile('anime.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500
            res.write('Error en el servidor');
            return res.end()
        } else {
            const animes = JSON.parse(data);
            const anime = animes[clave];
            if (anime) {
                res.json(anime);
            } else {
                res.statusCode = 404
                res.write('Anime no encontrado');
                return res.end()
            }
        }
    });
});




app.post('/anime', (req, res) => {
    const anime = req.body;
    const { nombre, genero, año, autor } = anime;

    // Verifica los campos requeridos
    if (!nombre || !genero || !año || !autor) {
        res.statusCode = 400
        res.write('Todos los campos son requeridos')
        return res.end()

    }

    fs.readFile('anime.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500
            res.write('Error en el servidor')
            return res.end()
        }

        const animes = JSON.parse(data);

        // Verifica si el anime ya existe por el nombre
        const animeExistente = Object.values(animes).find(
            (item) => item.nombre.toLowerCase() === nombre.toLowerCase()
        );
        if (animeExistente) {
            res.statusCode = 409
            res.write('El anime ya existe');
            return res.end()
        }

        // Verifica si el ID ya existe
        const idExistente = Object.keys(animes).find((key) => key === anime.id);
        if (idExistente) {
            res.statusCode = 409
            res.write('El ID ya existe')
            return res.end()
        }

        // Genera key incremental
        const keys = Object.keys(animes);
        const nextKey = (keys.length + 1).toString();

        // Agregar el nuevo anime al objeto
        animes[nextKey] = anime;

        // Guarda los datos actualizados en el archivo anime.json
        fs.writeFile('anime.json', JSON.stringify(animes, null, 2), 'utf8', (err) => {
            if (err) {
                res.statusCode = 500
                res.write('Error en el servidor')
                return res.end()
            }
            res.statusCode = 201
            res.write('Anime registrado con éxito');
            return res.end()
        });
    });
});


app.delete('/anime/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('anime.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500
            res.write('Error en el servidor');
            return res.end()
        }

        const animes = JSON.parse(data);

        // Verifica si el anime existe por ID
        if (animes[id]) {
            delete animes[id];

            // Ajusta las keys para que al eliminar un anime, se vuelvan a ordenar desde el 1 en adelante
            const keys = Object.keys(animes);
            const ajusteAnime = {};
            let newIndex = 1;
            for (const key of keys) {
                ajusteAnime[newIndex.toString()] = animes[key];
                newIndex++;
            }

            // Guardar los datos actualizados en el archivo JSON
            fs.writeFile('anime.json', JSON.stringify(ajusteAnime, null, 2), 'utf8', (err) => {
                if (err) {
                    res.statusCode = 500
                    res.write('Error en el servidor');
                    return res.end()
                }
                res.write('Anime eliminado con éxito');
                return res.end()
            });
        } else {
            res.statusCode = 404
            res.write('Anime no encontrado');
            return res.end()
        }
    });
});





const servidor = app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});


module.exports = { servidor }