<a id="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/user-attachments/assets/bfabf983-bc04-4528-bc9a-472fa44e9cc9" alt="AlexPhone" height="60">
  </a>

  <h3 align="center">Prueba técnica AlexPhone</h3>

  <p align="center">
    Junior - 2025
    <br />
    <a href="https://www.linkedin.com/company/alexphone/jobs/"><strong>Oferta de trabajo »</strong></a>
    <br />
    <br />
    <a href="mailto:developers@alexphone.com">Contacto</a>
    &middot;
    <a href="https://www.alexphone.es">Nuestra Web</a>
  </p>
</div>

¡Hola candidato! 

Desde AlexPhone, queremos apostar por actualizar y crear nuevas experiencias para nuestros clientes. Es por esto que desde negocio nos han pedido crear una nueva web e-commerce con la que deslumbrar a nuestros clientes. Para esta aplicación, nuestros compis de Back-End nos han preparado una API preparada para abastecernos con los datos que necesitamos. La estructura de la web será la siguiente:

  - Tendremos un layout con 2 partes principales.
    - Una barra de navegación superior, con el logo de AlexPhone a la izquierda, y a la derecha un botón que nos redirigirá al carrito de compra.
    - La sección principal, donde se mostrará la página actual.
   
  - La página principal será una lista de iPhones que podamos comprar.
    - Se mostrará como una grid de elementos.
    - Cada elemento tendrá una imagen, un título, precio y sus características (color, grado y capacidad).
    - También desde negocio nos comentan que les gustaría filtrar y ordenar.
    - También quieren que al refrescar, podamos mantener este filtrado y ordenado en la URL para que sea más comodo para el usuario compartir los enlaces filtrados.
  - Al hacer click en cualquier elemento, nos redirigirá a su página de detalle. En el detalle, veremos un layout de dos columnas.
    - A la izquierda, la imagen del iPhone que estamos visitando.
    - A la derecha toda su información completa (Título, precio, descripción, capacidad, grado y color). Además, contaremos con un botón que nos añadirá este teléfono a nuestro carrito de compra.

  - Al hacer click en el botón del carrito en la barra de navegación superior, nos redirigirá a la pantalla de carrito. En ella, nos mostrará una lista vertical con los productos añadidos. Desde negocio también nos comentan que les gustaría que los productos del carrito se mantengan guardados entre sesiones, para que los clientes no pierdan el progreso realizado.
    - En esta página, también habra un botón para realidar el pedido. Esto enviará los productos al Back-End y validará que todo está correcto.

A nivel ténico, nuestro Project Manajer nos ha pasado algunos criterios sobre cómo espera que la socluión sea implementada:
- Es obligatorio usar Git y hacerlo bien (metodología Git Flow, commits frecuentes y relevantes, etc...) porque quieren ir echándole un vistazo al código de vez en cuando.
- Debemos hacer tests tanto unitarios como de integración.
- Uso de formateadores de código (linter) en el proyecto para garantizar un estado homogéneo del código.
- También le gustaría que se desplegara el proyecto en algúna plataforma (a elección personal) para poder ver una preview del proyecto.

## API AlexPhone:
  - Lista de iPhones -> GET https://test.alexphone.com/api/v1/skus -> Lista de SKU (`Sku[]`)
  - Detalle de iPhone -> GET https://test.alexphone.com/api/v1/sku/{sku} -> SKU (`Sku`)
  - Confirmación de compra -> PUT https://test.alexphone.com/api/v1/order -> Void
    - Validación: Este endpoint valida si los objetos enviados tienen este contrato:
    ```javascript
    interface CreateOrderSku {
      id: string
      sku: string
      grade: SkuGrade
      color: SkuColor
      storage: SkuStorage
    }

    interface CreateOrderBody {
      skus: Sku[]
    }
    ```

## Valores devueltos por la API:
SKU: 
```javascript
interface Sku {
  id: string
  sku: string
  name: string
  description: string
  price: number
  grade: SkuGrade
  color: SkuColor
  storage: SkuStorage
  image: string
}

type SkuGrade = "excellent" | "very_good" | "good"
type SkuColor = "white" | "black" | "red" | "pink"
type SkuStorage = 64 | 128 | 256 | 512
```  
