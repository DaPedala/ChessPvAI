<script lang="ts">
	import { enhance } from '$app/forms';
	import { i18n } from '$lib/stores/langStore';

	let { form } = $props<{ form?: { error?: string } }>();
</script>

<svelte:head>
	<title>{$i18n.auth_login_title} — ChessPvAI</title>
</svelte:head>

<div class="auth-wrap">
	<div class="auth-card">
		<div class="auth-logo">♔</div>
		<h1 class="auth-heading">{$i18n.auth_login_title}</h1>
		<p class="auth-sub">{$i18n.auth_login_sub}</p>

		{#if form?.error}
			<p class="auth-error">{form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<div class="field">
				<label for="email">{$i18n.auth_email}</label>
				<input id="email" name="email" type="email" required autocomplete="email" placeholder="you@example.com" />
			</div>

			<div class="field">
				<label for="password">{$i18n.auth_password}</label>
				<input id="password" name="password" type="password" required autocomplete="current-password" placeholder="••••••••" />
			</div>

			<button type="submit" class="btn-submit">{$i18n.auth_login_btn}</button>
		</form>

		<p class="auth-switch">
			{$i18n.auth_no_account}
			<a href="/auth/register">{$i18n.auth_register_link}</a>
		</p>
	</div>
</div>

<style>
	.auth-wrap {
		min-height: calc(100vh - var(--nav-h));
		display: flex; align-items: center; justify-content: center;
		padding: 40px 16px;
	}

	.auth-card {
		width: 100%; max-width: 420px;
		background: var(--bg2);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 40px 36px;
	}

	.auth-logo {
		font-size: 2rem; color: var(--accent);
		text-align: center; margin-bottom: 16px;
	}

	.auth-heading {
		font-family: var(--serif); font-size: 1.6rem; font-weight: 700;
		color: var(--text-top); text-align: center; margin-bottom: 6px;
	}

	.auth-sub {
		font-size: .83rem; color: var(--text-dim); font-family: var(--mono);
		text-align: center; margin-bottom: 28px;
	}

	.auth-error {
		background: rgba(204,25,0,.15); border: 1px solid rgba(204,25,0,.4);
		color: #ff6b55; border-radius: 4px;
		padding: 10px 14px; font-size: .85rem;
		margin-bottom: 20px;
	}

	.field { margin-bottom: 18px; }
	.field label {
		display: block; margin-bottom: 6px;
		font-size: .76rem; font-family: var(--mono);
		letter-spacing: .07em; text-transform: uppercase;
		color: var(--text-dim);
	}
	.field input {
		width: 100%; padding: 10px 14px;
		background: var(--bg3); border: 1px solid var(--border);
		border-radius: 4px; color: var(--text-top);
		font-family: var(--mono); font-size: .95rem;
		outline: none; transition: border-color .15s;
	}
	.field input:focus { border-color: var(--accent); }

	.btn-submit {
		width: 100%; margin-top: 8px;
		padding: 12px;
		background: var(--accent); color: #fff;
		border: none; border-radius: 4px;
		font-family: var(--mono); font-size: .9rem; font-weight: 700;
		cursor: pointer; transition: background .15s;
	}
	.btn-submit:hover { background: var(--accent-h); }

	.auth-switch {
		margin-top: 24px; text-align: center;
		font-size: .83rem; color: var(--text-dim); font-family: var(--mono);
	}
	.auth-switch a { color: var(--accent); }
	.auth-switch a:hover { text-decoration: underline; }
</style>
