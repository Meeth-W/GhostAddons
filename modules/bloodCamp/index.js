import config from "../../config"

// Texture Credits: DocilElm
const skullTextures = new Set([
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNlYzQwMDA4ZTFjMzFjMTk4NGY0ZDY1MGFiYjM0MTBmMjAzNzExOWZkNjI0YWZjOTUzNTYzYjczNTE1YTA3NyJ9fX0K", // M2, M3, F6
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTVjMWRjNDdhMDRjZTU3MDAxYThiNzI2ZjAxOGNkZWY0MGI3ZWE5ZDdiZDZkODM1Y2E0OTVhMGVmMTY5Zjg5MyJ9fX0K", // M5
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmY2ZTFlN2VkMzY1ODZjMmQ5ODA1NzAwMmJjMWFkYzk4MWUyODg5ZjdiZDdiNWIzODUyYmM1NWNjNzgwMjIwNCJ9fX0K", // M6
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWZkNjFlODA1NWY2ZWU5N2FiNWI2MTk2YThkN2VjOTgwNzhhYzM3ZTAwMzc2MTU3YjZiNTIwZWFhYTJmOTNhZiJ9fX0K", // F5
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjM3ZGQxOGI1OTgzYTc2N2U1NTZkYzY0NDI0YWY0YjlhYmRiNzVkNGM5ZThiMDk3ODE4YWZiYzQzMWJmMGUwOSJ9fX0K", // M1, F4
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTY2MmI2ZmI0YjhiNTg2ZGM0Y2RmODAzYjA0NDRkOWI0MWQyNDVjZGY2NjhkYWIzOGZhNmMwNjRhZmU4ZTQ2MSJ9fX0K", // M4, F7
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjczOWQ3ZjRlNjZhN2RiMmVhNmNkNDE0ZTRjNGJhNDFkZjdhOTI0NTVjOWZjNDJjYWFiMDE0NjY1YzM2N2FkNSJ9fX0K", // M7
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTdkYjE5MjNkMDNjNGVmNGU5ZjZlODcyYzVhNmFkMjU3OGIxYWZmMmIyODFmYmMzZmZhNzQ2NmM4MjVmYjkifX19", // F1, F2
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjVmMGQ3OGZlMzhkMWQ3Zjc1ZjA4Y2RjZjJhMTg1NWQ2ZGEwMzM3ZTExNGEzYzYzZTNiZjNjNjE4YmM3MzJiMCJ9fX0K" // F3
])
const mobsTextures = new Set([
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDEwNjQwNTAsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzVhNzk4NjBhY2E3OTk0MDdjMGZhYTEwYjFiYmNmNDI5OThmYWQ0ZWJjZjMxZDdhMjE0MTgwODI2YjRhYzk0ZTEifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDExODY2MzYsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzQ3NzQ4NzExOTBjODc4YzlhMmM0NDk2YzFlMTAyNTdjNmM0ZWExMzgwN2Q3MmMxNWQ3YWM2YWIzYTdhOWE4ZGMifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDAyMDM1NzMsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2Y0NjI0YTlhOGM2OWNhMjA0NTA0YWJiMDQzZDQ3NDU2Y2Q5YjA5NzQ5YTM2MzU3NDYyMzAzZjI3NmEyMjlkNCJ9fX0=",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDExNDUyMjIsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2M5MTllNWI4ZDU2ZjA2MmEyMWQyMjRkZTE0YWY3NzFlMmY1NWQwOWI1OWU3YjA5OWQwOWRhYTU3NTQwYjc5Y2YiLCJtZXRhZGF0YSI6eyJtb2RlbCI6InNsaW0ifX19fQ==",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA1MzgzODIsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2E4OWY2MzAzYWY4NTg3NzYxMDkxMmRjMDRiOGIxZTg5NzI0NzUyZjBhN2VlYTA1YWI2NTQ3ZTIyODE3OWMwNmYiLCJtZXRhZGF0YSI6eyJtb2RlbCI6InNsaW0ifX19fQ==",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA5ODk1NTgsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzY3MjM3ZWRkYWViZGJiZGFhY2ZhOTEyODg1NTYwY2NkYzY1ZGE5M2I0YzNkNTEzNTMyODY4ZWMyM2JiNWI0NDgifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA0OTUwMjgsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2ZmMTg0YzE5ZTcyNTYyM2QzMjgyOGEwYTRlNzQxZTg2ZjEzNWFjNjNkYmM4MjhmZjNjODQ2ODMzOGYzNjgzYiJ9fX0=",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDEwMzA3NjUsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzVjY2NkNTNmNTE5MWMyOWE5ZGM4ZjAxNzBmYmRjNGU1OWU2NjQ3NmFhZTMzZGUyN2I0NjhmMWRlMWI3Y2YzYjIifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA5MTc4NzYsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2I1YmE3NmUwMmNhYjcyZmE3ZDhhYzU0Y2VlYzg0OTk3NmFiMGIwMGEwMTA2OGQ2OGMyNjY3NjZiZjcwYzM5OTcifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA3Njk2MTQsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2FhMjNjOGNkZTI5NDNjODQyNDlkZTgzNTFiYzM1NDBiZTVmOGFmYWFiYThiMmNiMDMyZmM1YWNhZDc4YTI2OWIifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA4MTg4MDMsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzkxNzFmMzViOGY1MDgxNDJiZDhjNjU0MTdkMGYzMjQxNTNhYjkxNDc3MzllZTRkMTBkZWE3MzNjYzgwZWFhMjAifX19",
    "eyJ0aW1lc3RhbXAiOjE1ODYwNDA5NTY0MjIsInByb2ZpbGVJZCI6ImRhNDk4YWM0ZTkzNzRlNWNiNjEyN2IzODA4NTU3OTgzIiwicHJvZmlsZU5hbWUiOiJOaXRyb2hvbGljXzIiLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzdkMTJiMmFkZTQxM2E2Y2Q3Y2NhM2M5NWU5NjFiYTlmMGFlNzE2NWZhNDFmYzdiNWQ1ZjA5NGEwMTI0MGM2MDkifX19",
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTZjM2UzMWNmYzY2NzMzMjc1YzQyZmNmYjVkOWE0NDM0MmQ2NDNiNTVjZDE0YzljNzdkMjczYTIzNTIifX19",
    "ewogICJ0aW1lc3RhbXAiIDogMTU4OTkyMzE2OTIxMSwKICAicHJvZmlsZUlkIiA6ICJhMmY4MzQ1OTVjODk0YTI3YWRkMzA0OTcxNmNhOTEwYyIsCiAgInByb2ZpbGVOYW1lIiA6ICJiUHVuY2giLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODQyMWJhNWI4ZTM1NzNlZjk3YmViNWI0MGUxNWQxNWIyMGYzMDYzMWM0YzUzMzBjM2RlZGEzMDQ3ZGYwZTkyIgogICAgfQogIH0KfQ==",
    "ewogICJ0aW1lc3RhbXAiIDogMTU4OTkyMzExMjUwMCwKICAicHJvZmlsZUlkIiA6ICJhMmY4MzQ1OTVjODk0YTI3YWRkMzA0OTcxNmNhOTEwYyIsCiAgInByb2ZpbGVOYW1lIiA6ICJiUHVuY2giLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWQyMjc3MmY3NjkwNDVmZGM1YmU4MTlhZDY4YjAxYTk3YWMwNGM2MDg4NmQyY2E3YWZlZTM5YjI4MmY3YTM4MyIKICAgIH0KICB9Cn0=",
    "ewogICJ0aW1lc3RhbXAiIDogMTU4OTkyMzM4Njc5NCwKICAicHJvZmlsZUlkIiA6ICJhMmY4MzQ1OTVjODk0YTI3YWRkMzA0OTcxNmNhOTEwYyIsCiAgInByb2ZpbGVOYW1lIiA6ICJiUHVuY2giLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWQ2N2Y5N2Q3ZjgyMTcyOWJlYjM0YTgyYzNmMTM1OTJiNDA0MzlmZTUyNDhlNzI1NzZmZGU3YWExODBiZjc3IgogICAgfQogIH0KfQ==",
    "ewogICJ0aW1lc3RhbXAiIDogMTU4OTkyMzIxNTkwNSwKICAicHJvZmlsZUlkIiA6ICJhMmY4MzQ1OTVjODk0YTI3YWRkMzA0OTcxNmNhOTEwYyIsCiAgInByb2ZpbGVOYW1lIiA6ICJiUHVuY2giLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmIzOTczYTc1MmIyNGEyZjNhYmIwMDM0MjdmNmRiZTZjYTNhNjFkYjBhMWJjZjM1MWM2ZWFiMjdlYzI3ZTUwIgogICAgfQogIH0KfQ==",
    "eyJ0aW1lc3RhbXAiOjE1NzQ0MTkzMTAxNjQsInByb2ZpbGVJZCI6Ijc1MTQ0NDgxOTFlNjQ1NDY4Yzk3MzlhNmUzOTU3YmViIiwicHJvZmlsZU5hbWUiOiJUaGFua3NNb2phbmciLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzEyNzE2ZWNiZjViOGRhMDBiMDVmMzE2ZWM2YWY2MWU4YmQwMjgwNWIyMWViOGU0NDAxNTE0NjhkYzY1NjU0OWMifX19",
    "ewogICJ0aW1lc3RhbXAiIDogMTU4OTkyMzAyODAxNSwKICAicHJvZmlsZUlkIiA6ICJhMmY4MzQ1OTVjODk0YTI3YWRkMzA0OTcxNmNhOTEwYyIsCiAgInByb2ZpbGVOYW1lIiA6ICJiUHVuY2giLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzI2MDMyNTE3MWE3YmE4NDYwODMwYzBlZWE1MTVjNzU3YTY2NWU1YjE2YTE0MjA3YmExYTMxODI3NTJiZWU4NyIKICAgIH0KICB9Cn0=",
    "ewogICJ0aW1lc3RhbXAiIDogMTU5NTQyODIyMDAyMCwKICAicHJvZmlsZUlkIiA6ICJkYTQ5OGFjNGU5Mzc0ZTVjYjYxMjdiMzgwODU1Nzk4MyIsCiAgInByb2ZpbGVOYW1lIiA6ICJOaXRyb2hvbGljXzIiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjJkOGZkM2FhNTYxN2IxZGFjMGFhZTljODFmNmRkNzBhZDkzYTU5OTQyZjQ2MGQyN2U0ZDU1YTVjYjg5MThlOCIKICAgIH0KICB9Cn0=",
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTZmYzg1NGJiODRjZjRiNzY5NzI5Nzk3M2UwMmI3OWJjMTA2OTg0NjBiNTFhNjM5YzYwZTVlNDE3NzM0ZTExIn19fQ==",
    "ewogICJ0aW1lc3RhbXAiIDogMTU4OTc5MzA2ODgzOSwKICAicHJvZmlsZUlkIiA6ICIyYzEwNjRmY2Q5MTc0MjgyODRlM2JmN2ZhYTdlM2UxYSIsCiAgInByb2ZpbGVOYW1lIiA6ICJOYWVtZSIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS83ZGU3YmJiZGYyMmJmZTE3OTgwZDRlMjA2ODdlMzg2ZjExZDU5ZWUxZGI2ZjhiNDc2MjM5MWI3OWE1YWM1MzJkIgogICAgfQogIH0KfQ==",
    "eyJ0aW1lc3RhbXAiOjE1NzQ0MTkzMTAxNjQsInByb2ZpbGVJZCI6Ijc1MTQ0NDgxOTFlNjQ1NDY4Yzk3MzlhNmUzOTU3YmViIiwicHJvZmlsZU5hbWUiOiJUaGFua3NNb2phbmciLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzEyNzE2ZWNiZjViOGRhMDBiMDVmMzE2ZWM2YWY2MWU4YmQwMjgwNWIyMWViOGU0NDAxNTE0NjhkYzY1NjU0OWMifX19",
    "ewogICJ0aW1lc3RhbXAiIDogMTU5ODk3NzI1OTM1NywKICAicHJvZmlsZUlkIiA6ICJlNzkzYjJjYTdhMmY0MTI2YTA5ODA5MmQ3Yzk5NDE3YiIsCiAgInByb2ZpbGVOYW1lIiA6ICJUaGVfSG9zdGVyX01hbiIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS9jMTAwN2M1YjcxMTRhYmVjNzM0MjA2ZDRmYzYxM2RhNGYzYTBlOTlmNzFmZjk0OWNlZGFkYzk5MDc5MTM1YTBiIgogICAgfQogIH0KfQ=="
])

const highlightSpot = register('renderWorld', (partialTicks) => {

}).unregister();

const scanEntitys = register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
    if (!(event.entity instanceof clazz)) return

}).unregister();

const scanEntityLookMove = register("packetReceived", (packet) => {
    let mcEntity = packet.func_149065_a(World.getWorld());
    let [x, y, z] = [packet.func_149062_c(), packet.func_149061_d(), packet.func_149064_e()]

}).setFilteredClass(net.minecraft.network.play.server.S14PacketEntity$S17PacketEntityLookMove).unregister();

const onfourSpawn = register('chat', () => {

}).setCriteria(/^\[BOSS\] The Watcher\: Let\'s see how you can handle this\.$/);

const onBloodDone = register('chat', () => {

}).setCriteria(/^\[BOSS\] The Watcher\: Let\'s see how you can handle this\.$/);

export function toggle() {
    if (config.bloodCampToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Blood Camp &amodule.")
        return
    }
    if (config.debug) chat("&cStopping the &6Blood Camp &cmodule.")
    return
}
export default { toggle };