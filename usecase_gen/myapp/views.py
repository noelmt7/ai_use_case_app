import requests
from django.http import FileResponse
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

# Login view for handling user authentication
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            # User authenticated successfully, return JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"detail": "Invalid credentials"}, status=401)


# Enhanced research agent for gathering industry-related data
class EnhancedResearchAgent:
    def __init__(self):
        self.api_key = '5402a7bfd62fcf4fa0b44ea525ce9b7093938358b0c62f86757ee96f82b6815e'  # Replace with your actual SerpAPI key
        self.api_url = 'https://serpapi.com/search'

    def search(self, query):
        params = {
            'q': query,
            'api_key': self.api_key,
            'num': 10,
        }

        response = requests.get(self.api_url, params=params)
        response.raise_for_status()
        return response.json()

    def gather_data(self, industry):
        queries = {
            "trusted_reports": f"AI and digital transformation {industry} McKinsey Deloitte Nexocode report",
            "specific_use_cases": f"AI applications in {industry} manufacturing or operations",
            "industry_trends": f"Emerging trends in AI adoption in {industry} (2024)",
            "success_stories": f"Success stories of AI implementation in {industry} 2024",
            "top_challenges": f"Top challenges in AI adoption in {industry} 2024",
            "future_opportunities": f"Future opportunities for AI in {industry} sector",
            "technology_partners": f"Leading AI technology partners for {industry} 2024",
            "regulations_and_compliance": f"AI regulations and compliance in {industry}",
            "case_studies": f"Case studies of AI in {industry}",
            "market_analysis": f"AI market analysis and forecast for {industry} 2024",
            "investment_trends": f"AI investment trends in {industry} 2024",
            "tools_and_platforms": f"Best AI tools and platforms for {industry}",
            "workforce_impact": f"Impact of AI on workforce and skill requirements in {industry}",
            "competitive_landscape": f"AI competitive landscape in {industry}",
        }

        results = {}

        for key, query in queries.items():
            try:
                results[key] = self.search(query)
            except requests.exceptions.RequestException as e:
                results[key] = {"error": str(e)}
        return results

    @staticmethod
    def generate_summary(data):
        summary = []
        for key, result in data.items():
            summary.append(f'## {key.replace("_", " ").title()} ##')
            for i, item in enumerate(result.get('organic_results', []), start=1):
                title = item.get('title', 'No Title')
                link = item.get('link', 'No Link')
                snippet = item.get('snippet', 'No Snippet')
                summary.append(f'{i}. **{title}**\n{snippet}\n[Read More]({link})\n\n')
        return '\n'.join(summary)

    @staticmethod
    def generate_pdf(content):
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        y = height - 30
        line_height = 14

        # Register a standard font
        pdf.setFont('Helvetica', 11)

        for line in content.split('\n'):
            clean_line = line.replace('#', '').replace('*', '').strip()

            if clean_line.startswith('##'):
                pdf.setFont('Helvetica-Bold', 13)
                pdf.drawString(30, y, clean_line)
                y -= line_height
            else:
                pdf.setFont('Helvetica', 11)
                pdf.drawString(30, y, clean_line)
                y -= line_height

            if y <= 30:  # Start a new page if space runs out
                pdf.showPage()
                y = height - 30

        pdf.save()
        buffer.seek(0)
        return buffer


# Industry analysis view to gather and return research data
class IndustryAnalysisView(APIView):
    def get(self, request):
        # Retrieve the industry query parameter
        industry = request.query_params.get('industry', '')
        if not industry:
            return Response({"error": "Industry parameter is required"}, status=400)

        # Log the received industry for debugging
        print(f"Received industry: {industry}")

        try:
            agent = EnhancedResearchAgent()
            research_data = agent.gather_data(industry)
            summary = agent.generate_summary(research_data)
        except Exception as e:
            # Log any errors during data gathering or processing
            print(f"Error while gathering data: {e}")
            return Response({"error": "Error while processing the request"}, status=500)

        return Response({"summary": summary})


# PDF download view for generating and downloading the PDF
class DownloadPDFView(APIView):
    def post(self, request):
        summary = request.data.get('summary', '')
        if not summary:
            return Response({"error": "Summary parameter is required"}, status=400)

        pdf_buffer = EnhancedResearchAgent.generate_pdf(summary)
        return FileResponse(pdf_buffer, as_attachment=True, filename='summary.pdf')


# Register view for handling user registration
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create(username=username, password=make_password(password))
        user.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "access": access_token,
            "refresh": str(refresh)
        })
