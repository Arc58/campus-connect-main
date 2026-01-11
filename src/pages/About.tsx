import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">About Campus Connect</h1>
        <p className="text-lg text-muted-foreground">
          The marketplace designed specifically for college students to buy, sell, and trade items within their campus community.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Community First</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built for students, by students. Connect with peers on your campus to find great deals on textbooks, electronics, furniture, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Trading</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              List items in seconds, browse by category, and contact sellers directly. No complicated shipping – meet on campus for easy exchanges.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Safe & Secure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Verified student accounts only. Trade with confidence knowing you're dealing with fellow students from your institution.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Sustainable</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Give items a second life instead of throwing them away. Reduce waste and save money by reusing within your campus community.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Create an Account</h3>
              <p className="text-muted-foreground">Sign up with your email to get started.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Browse or List</h3>
              <p className="text-muted-foreground">Find items you need or list items you want to sell.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Connect & Trade</h3>
              <p className="text-muted-foreground">Contact sellers directly and arrange campus meetups.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>© 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  );
};

export default About;
