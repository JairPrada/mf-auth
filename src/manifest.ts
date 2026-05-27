import { defineManifest } from "@journals/mf-contract";

export const manifest = defineManifest({
  name: "mf-auth",
  version: "0.0.1",
  framework: "react",
  port: 3002,
  components: [
    {
      name: "Otp",
      description: "Validacion OTP de 6 digitos",
      props: [
        {
          name: "emit",
          type: "function",
          required: true,
          description: "Event emitter del Shell",
        },
        {
          name: "phone",
          type: "string",
          required: false,
          description: "Numero de telefono enmascarado",
        },
      ],
    },
  ],
  events: [
    {
      event: "otp:submit",
      description: "Usuario ingreso el codigo OTP correctamente",
      direction: "emits",
      payload: {
        code: { type: "string", description: "Codigo OTP de 6 digitos" },
        postId: { type: "number", description: "ID del POST creado" },
      },
    },
  ],
});
