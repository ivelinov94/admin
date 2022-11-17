-- public.all_auth_recipe_users definition

-- Drop table

-- DROP TABLE public.all_auth_recipe_users;

CREATE TABLE public.all_auth_recipe_users (
	user_id bpchar(36) NOT NULL,
	recipe_id varchar(128) NOT NULL,
	time_joined int8 NOT NULL,
	CONSTRAINT all_auth_recipe_users_pkey PRIMARY KEY (user_id)
);
CREATE INDEX all_auth_recipe_users_pagination_index ON public.all_auth_recipe_users USING btree (time_joined DESC, user_id DESC);


-- public.passwordless_users definition

-- Drop table

-- DROP TABLE public.passwordless_users;

CREATE TABLE public.passwordless_users (
	user_id bpchar(36) NOT NULL,
	email varchar(256) NULL,
	phone_number varchar(256) NULL,
	time_joined int8 NOT NULL,
	CONSTRAINT passwordless_users_email_key UNIQUE (email),
	CONSTRAINT passwordless_users_phone_number_key UNIQUE (phone_number),
	CONSTRAINT passwordless_users_pkey PRIMARY KEY (user_id)
);


-- public.session_info definition

-- Drop table

-- DROP TABLE public.session_info;

CREATE TABLE public.session_info (
	session_handle varchar(255) NOT NULL,
	user_id varchar(128) NOT NULL,
	refresh_token_hash_2 varchar(128) NOT NULL,
	session_data text NULL,
	expires_at int8 NOT NULL,
	created_at_time int8 NOT NULL,
	jwt_user_payload text NULL,
	CONSTRAINT session_info_pkey PRIMARY KEY (session_handle)
);


-- public.user_metadata definition

-- Drop table

-- DROP TABLE public.user_metadata;

CREATE TABLE public.user_metadata (
	user_id varchar(128) NOT NULL,
	user_metadata text NOT NULL,
	CONSTRAINT user_metadata_pkey PRIMARY KEY (user_id)
);
