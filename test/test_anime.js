const chai = require("chai");
const chaiHttp = require("chai-http");
const { servidor } = require("../index")
chai.use(chaiHttp);


describe('API de Animes', () => {
    it('debería devolver todos los animes', (done) => {
        chai.request(servidor)
            .get('/anime')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.an('object');
                done();
            });
    });

    it("Comprobar que la respuesta sea un objeto", (done) => {
        chai.request(servidor)
            .get("/anime")
            .end((error, respuesta) => {
                chai.expect(respuesta.body).to.be.an("object");
                done();
            });
    });


    it('debería devolver un anime específico por ID', (done) => {
        const id = 3;

        chai.request(servidor)
            .get(`/anime/${id}`) // Utilizar el valor del ID (key) en la URL de la prueba
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.an('object');
                done();
            });
    });




});
