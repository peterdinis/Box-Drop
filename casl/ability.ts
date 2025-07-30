import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  Ability,
} from "@casl/ability";

type Actions = "manage" | "read" | "create" | "update" | "delete";

type Subjects = InferSubjects<"User"> | "all";

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilitiesFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

  if (role === "admin") {
    can("manage", "all");
  } else if (role === "user") {
    can("read", "User");
    cannot("delete", "User");
  } else {
    can("read", "User");
  }

  return build({
    detectSubjectType: (item) => item as ExtractSubjectType<Subjects>,
  });
}