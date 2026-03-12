# Autenticación JWT

Este proyecto ahora incluye autenticación basada en JWT (JSON Web Tokens). Todos los endpoints del CRUD requieren autenticación.

## Documentación Swagger con Candadito 🔒

En la documentación de Swagger (`http://localhost:3000/docs`), verás:

- **Candadito (🔒)**: Aparece en todos los endpoints protegidos indicando que requieren autenticación
- **Esquema "RSO"**: El nombre del esquema de seguridad JWT configurado

### Cómo usar la autenticación en Swagger:

1. Ve a `http://localhost:3000/docs`
2. Busca el endpoint `POST /auth/login` y ejecutalo con tus credenciales
3. Copia el `access_token` de la respuesta
4. Haz clic en el botón **"Authorize"** (candadito) en la parte superior derecha
5. En el modal que aparece, pega el token en el campo "Value" con el prefijo "Bearer "
6. Haz clic en "Authorize"
7. Ahora todos los endpoints mostrarán el candadito verde ✅ indicando que estás autenticado

### Endpoints con Candadito 🔒

Los siguientes endpoints requieren autenticación JWT y mostrarán el candadito en Swagger:

**Usuarios:**
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario
- `GET /usuarios/:id` - Obtener usuario específico
- `PUT /usuarios/:id` - Actualizar usuario
- `PATCH /usuarios/:id` - Actualizar parcialmente
- `DELETE /usuarios/:id` - Eliminar usuario
- `PATCH /usuarios/:id/estado/:estado` - Cambiar estado
- `GET /usuarios/correo/:correo` - Buscar por email

**Roles:**
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol
- `GET /roles/:id` - Obtener rol específico
- `PATCH /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

## Endpoints de Autenticación

### 1. Login - Obtener Token
**POST** `/auth/login`

**Body:**
```json
{
  "correo": "usuario@example.com",
  "clave": "tu_contraseña"
}
```

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "correo": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

## Cómo Usar los Endpoints Protegidos

Todos los endpoints de usuarios (`/usuarios`) y roles (`/roles`) requieren autenticación.

### Incluir el Token en las Peticiones

En el header `Authorization`, incluye el token en formato `Bearer`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo con cURL:
```bash
curl -X GET http://localhost:3000/usuarios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Ejemplo con Fetch:
```javascript
const token = 'your_jwt_token_here';

fetch('http://localhost:3000/usuarios', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Ejemplo con Axios:
```javascript
const token = 'your_jwt_token_here';

axios.get('http://localhost:3000/usuarios', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => console.log(res.data));
```

## Flujo de Autenticación

1. **Crear un usuario**: POST `/usuarios` (sin token, si así lo deseas)
   ```json
   {
     "nombre": "Juan",
     "apellido": "Pérez",
     "correo": "juan@example.com",
     "clave": "password123",
     "rolesIds": [1]
   }
   ```

2. **Obtener token**: POST `/auth/login`
   ```json
   {
     "correo": "juan@example.com",
     "clave": "password123"
   }
   ```

3. **Usar el token** en cualquier solicitud protegida:
   - Incluir header: `Authorization: Bearer <token>`

## Variables de Entorno

En tu archivo `.env` debes tener:

```env
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion_12345
PORT=3000
# ... otras variables
```

## Ejemplo Práctico de Uso

### 1. Crear un Usuario (sin autenticación)
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "clave": "password123",
    "telefono": "123456789",
    "direccion": "Calle 123",
    "rolesIds": [1]
  }'
```

### 2. Obtener Token JWT
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan@example.com",
    "clave": "password123"
  }'
```

### 3. Usar Token en Endpoints Protegidos
```bash
curl -X GET http://localhost:3000/usuarios \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Verificar en Swagger
1. Abre `http://localhost:3000/docs`
2. Ejecuta el login en `/auth/login`
3. Copia el token
4. Haz clic en "Authorize" (candadito)
5. Pega `Bearer TU_TOKEN` en el campo Value
6. Todos los endpoints mostrarán candadito verde ✅

## Características Actuales

- **Autenticación**: JWT basada en correo y contraseña
- **Token Expiration**: 24 horas
- **Endpoints Protegidos**:
  - `GET /usuarios`
  - `GET /usuarios/:id`
  - `POST /usuarios`
  - `PUT /usuarios/:id`
  - `PATCH /usuarios/:id`
  - `DELETE /usuarios/:id`
  - `GET /roles`
  - `POST /roles`
  - `GET /roles/:id`
  - `PATCH /roles/:id`
  - `DELETE /roles/:id`

## Notas Importantes

⚠️ **Contraseñas en Producción**:
- Actualmente las contraseñas se almacenan en texto plano en la BD
- En producción, debes hasharía las contraseñas usando `bcrypt`
- Actualiza la estrategia de validación en `src/auth/services/auth.service.ts`

⚠️ **JWT_SECRET en Producción**:
- Usa un secreto fuerte y único en producción
- No expongas el secreto en el código fuente
- Considera usar un servicio como AWS Secrets Manager

## Próximos Pasos Sugeridos

1. Implementar bcrypt para hash de contraseñas
2. Agregar roles y permisos (Role-Based Access Control - RBAC)
3. Implementar refresh tokens
4. Agregar validación adicional de credenciales
5. Implementar rate limiting en el endpoint de login
