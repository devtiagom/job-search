'use strict';

const User = use('App/Models/User');
const { validateAll } = use('Validator');

class AuthController {
	async register({ request, response }) {
		const rules = {
			name:		'required|max:80',
			email:      'required|email|max:254|unique:users',
			password:	'required|min:6|max:10|confirmed'
		};

		const errorMessages = {
			'name.required':		'O campo nome é obrigatório',
			'name.max':				'O nome completo deve ter no máximo 80 caracteres',
			'email.required':       'O campo e-mail é obrigatório.',
			'email.email':          'Endereço de e-mail inválido.',
			'email.max':			'O e-mail deve ter no máximo 254 caracteres.',
			'email.unique':         'Este e-mail já foi cadastrado.',
			'password.required':    'O campo senha é obrigatório.',
			'password.min':         'A senha deve ter pelo menos 6 caracteres.',
			'password.max':         'A senha deve ter no máximo 10 caracteres.',
			'password.confirmed':	'Confirmação de senha incorreta.'
		};

		const validation = await validateAll(request.all(), rules, errorMessages);

		if (validation.fails()) {
			const validationError = validation.messages()[0].message;
			return response
				.status(400)
				.send({ "msg": validationError });
		}
		
		try {
			const data = request.only(['name', 'email', 'password']);
			const user = await User.create(data);
			
			return response.status(201).send(user);
		} catch (error) {
			return response
				.status(500)
				// TODO: Tratamento do error (gerar errorCodes, logs, ...)
				.send({ 'msg': 'Não foi possível salvar o usuário no banco.' });
		}
	}

	async authenticate({ request, auth }) {		
		const { email, password } = request.all();
		const token = await auth.attempt(email, password);
	
		return token;
	}
}

module.exports = AuthController;
