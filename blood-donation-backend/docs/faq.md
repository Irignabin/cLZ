# Frequently Asked Questions (FAQ)

## Q: How do I set up the project?

See the [Setup Guide](./setup.md) for detailed instructions.

---

## Q: What do I do if migrations fail?

- Ensure your database connection details in `.env` are correct.
- Check that your database server is running.
- Run `php artisan migrate:fresh` to reset migrations if needed.

---

## Q: How can I get API tokens?

Use the `/api/login` endpoint with your user credentials to receive an access token.

---

## Q: Where can I find the API documentation?

Auto-generated API docs are available at:

```
http://localhost:8000/docs
```

---

## Q: Who do I contact for support?

Please open an issue in the repository or contact the maintainers.

---

## Q: Can I contribute to this project?

Yes! See the [Contribution Guidelines](./contribution.md) for details.