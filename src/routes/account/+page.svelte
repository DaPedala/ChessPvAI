<script lang="ts">
	import { enhance } from '$app/forms';
	import { i18n } from '$lib/stores/langStore';

	let { data, form } = $props<{
		data: { user: { id: string; email: string; display_name: string } };
		form?: { nameError?: string; nameSuccess?: boolean; passError?: string; passSuccess?: boolean };
	}>();
</script>

<svelte:head>
	<title>{$i18n.acc_title} — ChessPvAI</title>
</svelte:head>

<div class="page">
	<div class="header">
		<a href="/play" class="back">← {$i18n.acc_back}</a>
		<h1 class="title">{$i18n.acc_title}</h1>
		<p class="subtitle">{data.user.email}</p>
	</div>

	<div class="sections">
		<!-- Display name -->
		<section class="card">
			<h2 class="card-title">{$i18n.acc_display_name}</h2>
			<p class="card-desc">{$i18n.acc_display_name_desc}</p>

			{#if form?.nameError}
				<p class="msg msg-error">{form.nameError}</p>
			{:else if form?.nameSuccess}
				<p class="msg msg-ok">{$i18n.acc_name_saved}</p>
			{/if}

			<form method="POST" action="?/update_display_name" use:enhance>
				<div class="field">
					<label for="display_name">{$i18n.auth_display_name}</label>
					<input
						id="display_name" name="display_name" type="text"
						required minlength="2" maxlength="30"
						value={data.user.display_name}
					/>
				</div>
				<button type="submit" class="btn-primary">{$i18n.acc_save}</button>
			</form>
		</section>

		<!-- Password -->
		<section class="card">
			<h2 class="card-title">{$i18n.acc_password}</h2>
			<p class="card-desc">{$i18n.acc_password_desc}</p>

			{#if form?.passError}
				<p class="msg msg-error">{form.passError}</p>
			{:else if form?.passSuccess}
				<p class="msg msg-ok">{$i18n.acc_pass_saved}</p>
			{/if}

			<form method="POST" action="?/update_password" use:enhance>
				<div class="field">
					<label for="current_password">{$i18n.acc_current_pass}</label>
					<input id="current_password" name="current_password" type="password" required autocomplete="current-password" placeholder="••••••••" />
				</div>
				<div class="field">
					<label for="new_password">{$i18n.acc_new_pass}</label>
					<input id="new_password" name="new_password" type="password" required minlength="8" autocomplete="new-password" placeholder="••••••••" />
				</div>
				<div class="field">
					<label for="confirm_password">{$i18n.acc_confirm_pass}</label>
					<input id="confirm_password" name="confirm_password" type="password" required minlength="8" autocomplete="new-password" placeholder="••••••••" />
				</div>
				<button type="submit" class="btn-primary">{$i18n.acc_save}</button>
			</form>
		</section>
	</div>
</div>

<style>
	.page { max-width: 640px; margin: 0 auto; padding: 48px clamp(16px, 4vw, 48px) 80px; }

	.header { margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
	.back { font-family: var(--mono); font-size: .78rem; color: var(--accent); }
	.back:hover { text-decoration: underline; }
	.title {
		font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.4rem);
		font-weight: 900; color: var(--text-top); margin: 12px 0 6px;
	}
	.subtitle { font-size: .85rem; color: var(--text-dim); font-family: var(--mono); }

	.sections { display: flex; flex-direction: column; gap: 24px; }

	.card {
		background: var(--bg2); border: 1px solid var(--border);
		border-radius: 6px; padding: 28px 28px;
	}
	.card-title {
		font-family: var(--serif); font-size: 1.15rem; font-weight: 700;
		color: var(--text-top); margin-bottom: 6px;
	}
	.card-desc { font-size: .83rem; color: var(--text-dim); margin-bottom: 20px; }

	.msg {
		border-radius: 4px; padding: 10px 14px;
		font-size: .85rem; font-family: var(--mono);
		margin-bottom: 16px;
	}
	.msg-error { background: rgba(204,25,0,.15); border: 1px solid rgba(204,25,0,.4); color: #ff6b55; }
	.msg-ok    { background: rgba(98,153,36,.15); border: 1px solid rgba(98,153,36,.4); color: var(--accent); }

	.field { margin-bottom: 16px; }
	.field label {
		display: block; margin-bottom: 6px;
		font-size: .76rem; font-family: var(--mono);
		letter-spacing: .07em; text-transform: uppercase; color: var(--text-dim);
	}
	.field input {
		width: 100%; padding: 10px 14px;
		background: var(--bg3); border: 1px solid var(--border);
		border-radius: 4px; color: var(--text-top);
		font-family: var(--mono); font-size: .95rem;
		outline: none; transition: border-color .15s;
	}
	.field input:focus { border-color: var(--accent); }

	.btn-primary {
		padding: 10px 24px;
		background: var(--accent); color: #fff;
		border: none; border-radius: 4px;
		font-family: var(--mono); font-size: .88rem; font-weight: 700;
		cursor: pointer; transition: background .15s;
	}
	.btn-primary:hover { background: var(--accent-h); }
</style>
