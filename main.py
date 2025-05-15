import flet as ft
def main(tela:ft.Page):
    tela.window.width=300
    tela.window.height=300
    tela.horizontal_alignment=ft.MainAxisAlignment.CENTER
    tela.update()
    tela.add(ft.Row([ft.ElevatedButton("OK",on_click=lambda e: tela.window.close()),
            ft.Text("Ola Mundo")],
            ))
    return
ft.app(main)