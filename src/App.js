import React, { useReducer, useState } from "react";
import axios from "axios"
import "./App.css";

const api = axios.create({
  baseURL: "https://api.mercadopago.com"
});


api.interceptors.request.use(async config => {
  const token = 'APP_USR-631015051868223-070413-2bcf4779b6051ea38d36349526597c32-320609239'
  config.headers.Authorization = `Bearer ${token}`

  return config
});

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }
}

function App() {

  const [formData, setFormdata] = useReducer(formReducer, {})
  const [responsePayment, setResponsePayment] = useState(false)
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState(false)
  const [statusPayment, setStatusPayment] = useState(false)
  const [verify, setVerify] = useState(true)
  const [id, setId] = useState()


  const handleChange = event => {

    setFormdata({
      name: event.target.name,
      value: event.target.value
    })
  }




  const getStatusPayment = () => {
    api
      .get(`v1/payments/${responsePayment.data.id}`)
      .then(response => {
        if (response.data.status === "approved") {
          setVerify(false)
          setStatusPayment(true)
        } else {
          setStatusPayment(false)
        }
      })
  }

  if (verify) {
    var intervalId = setInterval(getStatusPayment, 30 * 1000);
  }



  const handleSubmit = (event) => {
    event.preventDefault()

    // console.log({ formData }.formData.nome)

    var raw = JSON.stringify({
      "transaction_amount": 2.00,
      "description": "BEATS SOLO 3 SEM FIO - PRETO",
      "payment_method_id": "pix",
      "payer": {
        "email": "vplayreix@gmail.com",
        "first_name": "Vinicius",
        "last_name": "Reis",
        "identification": {
          "type": "CPF",
          "number": "98261738787"
        }
      }
    });



    api.post("v1/payments", raw).then(response => {
      setId(response.data.id)
      setResponsePayment(response)
      setLinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url)
    }).catch(err => {
      console.debug("err", err)
    })
  }

  console.log(statusPayment)


  return (
    <div className="App">
      <header className="App-header">

        {
          !responsePayment && !statusPayment &&

          <div>
            <p className="text5">
              Carrinho de compras
            </p>
            <img src="https://images01.nicepage.io/4c/04/4c04f6649f009a5a4832a95f6e49b2fb.png" alt="Girl in a jacket" width="250" height="250"></img>
            <span className="login-form-title">
              BEATS SOLO 3
              SEM FIO - PRETO
            </span>
            <span className="txt3">
              R$ 299.99
            </span>

            <span className="txt4">
              Quantidade: 1
            </span>
            {

            }
            <form onSubmit={handleSubmit}>
              <button className="login-form-btn" type="submit">
                Finalizar Compra</button>
            </form>
          </div>

          // <form onSubmit={handleSubmit}>
          //   <div className="container">
          //     <div className="container-login">
          //       <div className="wrap-login">
          //         {/* <form className="login-form"> */}

          //         <span className="login-form-title">
          //           Informar Dados de Pagamento.
          //         </span>

          //         <div className="wrap-input">
          //           <input
          //             className={{ formData }.formData.email ? "has-val input" : "input"}
          //             onChange={handleChange} name="email"
          //           />
          //           <span className="focus-input" data-placeholder="Email:"></span>
          //         </div>

          //         <div className="wrap-input">
          //           <input className={{ formData }.formData.nome ? "has-val input" : "input"} onChange={handleChange} name="nome" />
          //           <span className="focus-input" data-placeholder="Nome:"></span>
          //         </div>

          //         <div className="wrap-input">
          //           <input className={{ formData }.formData.cpf ? "has-val input" : "input"} onChange={handleChange} name="cpf" />
          //           <span className="focus-input" data-placeholder="CPF:"></span>
          //         </div>

          //         <div className="wrap-input">
          //           <input className={{ formData }.formData.valor ? "has-val input" : "input"} onChange={handleChange} name="valor" />
          //           <span className="focus-input" data-placeholder="Valor:"></span>
          //         </div>

          //         <div className="container-login-form-btn" >
          //           <button className="login-form-btn" type="submit">
          //             Realizar Pagamento</button>
          //         </div>
          //         {/* </form> */}
          //       </div>
          //     </div>
          //   </div>
          // </form>
        }
        {/* {
          !responsePayment && <form onSubmit={handleSubmit}>

            <div>
              <label>E-mail</label>
              <input onChange={handleChange} name="email" />
            </div>

            <div>
              <label>Nome</label>
              <input onChange={handleChange} name="nome" />
            </div>

            <div>
              <label>CPF</label>
              <input onChange={handleChange} name="cpf" />
            </div>
            <div>
              <label>Valor</label>
              <input onChange={handleChange} name="valor" />
            </div>


            <div>
              <button type="submit">Pagar</button>
            </div>
          </form>
        } */}

        {/* {responsePayment &&
          <button onClick={getStatusPayment}>Verificar status pagamento</button>
        } */}

        {
          statusPayment ?

            <div>
              <img src="https://img.freepik.com/icones-gratis/verificado_318-663335.jpg" alt="Girl in a jacket" width="250" height="250"></img>
              <p className="text5">
                Pagamento Realizado com Sucesso!
              </p>
            </div>
            :
            linkBuyMercadoPago && !statusPayment &&
            < iframe src={linkBuyMercadoPago} width="100%" height="620px" title="link_buy" />

        }


      </header>
    </div >
  );
}

export default App;
