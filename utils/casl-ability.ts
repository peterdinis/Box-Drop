import {
	Ability,
	AbilityBuilder,
	type AbilityClass,
	type ExtractSubjectType,
	type InferSubjects,
} from "@casl/ability";

type Actions = "manage" | "read" | "create" | "update" | "delete";

type Subjects =
	| InferSubjects<{
			User: { id: string };
			File: { id: string; ownerId: string };
	  }>
	| "all";

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilitiesFor(role: "admin" | "user", userId: string) {
	const { can, cannot, build } = new AbilityBuilder<AppAbility>(
		Ability as AbilityClass<AppAbility>,
	);

	if (role === "admin") {
		can("manage", "all");
	} else if (role === "user") {
		can("read", "all");
		can("create", "all");

		can(["update", "delete"], "all", { ownerId: userId });

		can("read", "all");
		cannot("delete", "all");
	}

	return build({
		detectSubjectType: (item) =>
			item as unknown as ExtractSubjectType<Subjects>,
	});
}
