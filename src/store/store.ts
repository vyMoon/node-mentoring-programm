import { User } from '../user/types/user.interface';

export class Store {
	store: { [key: string]: User } = {
		'1': {
			id: '1',
			login: 'admin',
			password: '12345',
			age: 18,
			isDeleted: false
		},
		'2': {
			id: '2',
			login: 'administration',
			password: '12345',
			age: 18,
			isDeleted: false
		},
		'3': {
			id: '3',
			login: 'admin1',
			password: '12345',
			age: 18,
			isDeleted: false
		},
		'4': {
			id: '4',
			login: 'admin2',
			password: '12345',
			age: 18,
			isDeleted: false
		},
		'5': {
			id: '5',
			login: 'admin3',
			password: '12345',
			age: 18,
			isDeleted: false
		},
		'6': {
			id: '6',
			login: 'admin4',
			password: '12345',
			age: 18,
			isDeleted: false
		},
		'7': {
			id: '7',
			login: 'user',
			password: '12345',
			age: 33,
			isDeleted: false
		}
	};

	getUser(id: string): User | null {
		const user = this.store[id];
		if (user && !user.isDeleted) {
			return user;
		}
		return null;
	}

	getAllActive(): User[] {
		const ids = this.getIds();
		return ids.filter(id => !this.store[id].isDeleted)
			.map(id => this.store[id]);
	}

	getActiveUsersBylogin(login: string): User[] {
		return this.getAllActive()
			.filter(user => user.login.includes(login))
			.sort((a, b) => a.login.localeCompare(b.login));
	}

	saveUser(user: User): User {
		user.id = this.getNextId();
		user.isDeleted = false;
		this.store[user.id] = user;

		return this.store[user.id];
	}

	deleteUser(id: string): User | false {
		const user = this.getUser(id);
		if (user && !user.isDeleted) {
			user.isDeleted = true;
			return user;
		}
		return false;
	}

	updateUser(newUserData: User): User | false {
		const user = this.getUser(newUserData.id);
		if (user) {
			this.store[newUserData.id] = newUserData;
			return this.store[newUserData.id];
		}
		return false;
	}

	getNextId(): string {
		const ids = this.getIds();
		return ids.length === 0
			? '1'
			: String((Number(this.getMaxId(ids)) + 1));
	}

	getIds(): string[] {
		return Object.keys(this.store);
	}

	getMaxId(ids: string[]): string {
		return ids.reduce((a, b) => Number(a) > Number(b) ? a : b);
	}

	checkUser(userId: string): boolean {
		return !!this.store[userId];
	}
}

const store = new Store();

export function getStore(): Store {
  return store;
}
