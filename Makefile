.PHONY: setup run kill

# 1. Create env file only if missing + install dependencies
setup:
	@echo "Checking for api/.env.php..."
	@if [ ! -f api/.env.php ]; then \
		echo "Creating api/.env.php file..."; \
		echo "<?php" > api/.env.php; \
		echo "" >> api/.env.php; \
		echo "return [" >> api/.env.php; \
		echo "    'CLIENT_ID' => 'API Key'," >> api/.env.php; \
		echo "    'CLIENT_SECRET' => 'Secret Key'," >> api/.env.php; \
		echo "    'BASE_URL' => 'https://media.services.pbs.org/api/v1'," >> api/.env.php; \
		echo "    'BASIC_AUTH_KEY' => 'Base64-encoded basic authorization key that is combination of key + secret key'" >> api/.env.php; \
		echo "];" >> api/.env.php; \
		echo "api/.env.php file created. Please fill in your actual credentials!"; \
	else \
		echo "api/.env.php already exists. Skipping creation."; \
	fi
	cd app && npm install

# 2. Start PHP server and React Vite frontend
run:
	cd api && php -S localhost:8000 & \
	cd app && npm run dev

# 3. Kill PHP server
kill:
	pkill -f "php -S localhost:8000"
