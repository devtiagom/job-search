'use strict';

const User = use('App/Models/User');
const { validateAll } = use('Validator');

class AuthController {
	async register({ request, response }) {
		const rules = {
			email:      'required|email|unique:users',
			password:   'required|min:6|max:10|confirmed'
		};

		const errorMessages = {
			'email.required':       'Este campo é obrigatório.',
			'email.email':          'Endereço de e-mail inválido.',
			'email.unique':         'Este e-mail já foi cadastrado.',
			'password.required':    'Este campo é obrigatório.',
			'password.min':         'A senha deve ter pelo menos 6 caracteres.',
			'password.max':         'A senha deve ter no máximo 10 caracteres.',
			'password.confirmed':	'Confirmação de senha incorreta.'
		};

		const validation = await validateAll(request.all(), rules, errorMessages);

		if (validation.fails())
			return response
				.status(400)
				.send({ message: validation.messages() });
		
		try {
			const data = request.only(['email', 'password']);
			const user = await User.create(data);
			
			return response.status(201).send(user);
		} catch (error) {
			return response
				.status(500)
				.send({ error: `Erro: ${error.message}` });
		}
	}

	async authenticate({ request, auth }) {		
		const { email, password } = request.all();
		const token = await auth.attempt(email, password);
	
		return token;
	}
}

module.exports = AuthController;
