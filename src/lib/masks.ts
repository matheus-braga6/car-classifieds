export function maskCPF(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11)
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function maskCNPJ(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 14)
  return numbers
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function maskPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11)
  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

export function maskCEP(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 8)
  return numbers.replace(/(\d{5})(\d{1,3})$/, "$1-$2")
}

export function unmask(value: string) {
  return value.replace(/\D/g, "")
}